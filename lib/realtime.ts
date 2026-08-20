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
  if (isOnline) return "● Online";
  if (!lastSeenIsoOrMs) return "Offline";

  const date = typeof lastSeenIsoOrMs === "number" ? new Date(lastSeenIsoOrMs) : new Date(lastSeenIsoOrMs);
  const time = date.getTime();
  if (isNaN(time)) return "Offline";

  const diff = Date.now() - time;
  if (diff < 0 || diff < 60000) return "Active just now";
  
  const diffMin = Math.floor(diff / 60000);
  if (diffMin < 60) return `Active ${diffMin} min ago`;
  
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours === 1) return "Active 1 hour ago";
  if (diffHours < 24) return `Active ${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Active 1 day ago";
  return `Active ${diffDays} days ago`;
}
