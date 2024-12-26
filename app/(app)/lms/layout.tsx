import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="container mx-auto px-4 pt-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
