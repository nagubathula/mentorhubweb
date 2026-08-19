import { createClient } from "./supabase";

export const GLOBAL_PRESENCE_CHANNEL = "kindmentor-realtime-presence-v1";

/**
 * Safely creates or returns a clean RealtimeChannel, ensuring any previous
 * subscribed channel for the topic is cleanly removed first to prevent
 * "Cannot add callbacks for realtime after subscribe()" errors.
 */
export function getCleanChannel(supabase: any, topic: string, config?: any) {
  if (!supabase) return null;
  try {
    const existing = supabase.getChannels?.().find(
      (c: any) => c.topic === `realtime:${topic}` || c.topic === topic
    );
    if (existing) {
      supabase.removeChannel(existing);
    }
  } catch (e) {
    console.warn("Error cleaning existing realtime channel:", e);
  }
  return supabase.channel(topic, config);
}

/**
 * Format relative last active status string
 * E.g., "Online", "Active just now", "Active 5m ago", "Active 2h ago"
 */
export function formatLastActiveStatus(isOnline: boolean, lastSeenIsoOrMs?: string | number | null): string {
  if (isOnline) return "Online";
  if (!lastSeenIsoOrMs) return "Offline";

  const date = typeof lastSeenIsoOrMs === "number" ? new Date(lastSeenIsoOrMs) : new Date(lastSeenIsoOrMs);
  const time = date.getTime();
  if (isNaN(time)) return "Offline";

  const diff = Date.now() - time;
  if (diff < 0 || diff < 60000) return "Active just now";
  if (diff < 3600000) return `Active ${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `Active ${Math.floor(diff / 3600000)}h ago`;
  return `Active ${Math.floor(diff / 86400000)}d ago`;
}
