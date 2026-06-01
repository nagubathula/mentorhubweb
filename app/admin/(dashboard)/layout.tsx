import { Sidebar } from "@/components/admin/sidebar";
import { TopHeader } from "@/components/admin/top-header";
import { MobileNav } from "@/components/admin/mobile-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 relative">
        <TopHeader />
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8 lg:px-12 lg:py-10 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-8">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
