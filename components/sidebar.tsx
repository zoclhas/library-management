import { BookCopy, BookPlus, Home, LogOutIcon, Users } from "lucide-react";

import { logout } from "@/actions/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ThemeSwitch } from "./theme-switch";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/lms",
    icon: Home,
  },
  {
    title: "Add Log",
    url: "/lms/add",
    icon: BookPlus,
  },
  {
    title: "Books",
    url: "/lms/books",
    icon: BookCopy,
  },
  {
    title: "Students",
    url: "/lms/students",
    icon: Users,
  },
];

export function AppSidebar() {
  async function lo() {
    "use server";
    await logout();
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <ThemeSwitch />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <form action={lo}>
          <SidebarMenuButton type="submit">
            <LogOutIcon /> Logout
          </SidebarMenuButton>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
