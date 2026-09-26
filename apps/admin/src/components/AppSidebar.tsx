"use client";

import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  User2,
  ChevronUp,
  Plus,
  Shirt,
  User,
  ShoppingBasket,
  BookCheck,
  Footprints,
  OptionIcon,
  ShieldCheck,
  InfoIcon,
  Pencil,
  Contact,
  NewspaperIcon,
  Palette,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetTrigger } from "./ui/sheet";
import AddUser from "./AddUser";
import AddCategory from "./AddCategory";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLogout } from "@/hooks/auth";
import { useGetunreadStatsQuery } from "@/services/ChatsApi";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    role: ["admin", "seller", "client"],
  },
  {
    title: "Inbox",
    url: "/chats",
    icon: Inbox,
    role: ["admin"],
  },
  {
    title: "Contacts",
    url: "/contact-messages",
    icon: Contact,
    role: ["admin"],
  },
  {
    title: "News Letter",
    url: "/newsletter",
    icon: NewspaperIcon,
    role: ["admin"],
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    role: ["admin", "seller"],
  },
  {
    title: "Features",
    url: "/features",
    icon: OptionIcon,
    role: ["admin"],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    role: ["admin"],
  },
  {
    title: "Info",
    url: "/info",
    icon: InfoIcon,
    role: ["admin"],
  },
  {
    title: "Terms",
    url: "/terms",
    icon: Pencil,
    role: ["admin"],
  },
  {
    title: "Privacy",
    url: "/privacy",
    icon: ShieldCheck,
    role: ["admin"],
  },
];

const AppSidebar = () => {
  const [AdduserSheet, setAdduserSheet] = useState(false);
  const [AddcategorySheet, setAddcategorySheet] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const router = useRouter();
  const { logOutrHook } = useLogout();

  const { data } = useGetunreadStatsQuery("");

  const handleLogout = async () => {
    await logOutrHook();
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/Mylogo.png" alt="logo" width={20} height={20} />
                <span>{user?.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(
                (item) =>
                  item.role.includes(user?.role) && (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.title === "Inbox" && (
                        <SidebarMenuBadge>
                          {data?.chats_with_unread}-(
                          {data?.total_unread_messages})
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Products</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add Product</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/products">
                    <Shirt />
                    See All Products
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/products/add">
                    <Plus />
                    Add Product
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {user?.role == "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarGroupAction>
              <Plus /> <span className="sr-only">Add Category</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/categories">
                      <BookCheck />
                      See All Categories
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Sheet
                      open={AddcategorySheet}
                      onOpenChange={setAddcategorySheet}
                    >
                      <SheetTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link href="#">
                            <Plus />
                            Add Category
                          </Link>
                        </SidebarMenuButton>
                      </SheetTrigger>
                      <AddCategory setAddcategorySheet={setAddcategorySheet} />
                    </Sheet>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Orders</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/orders">
                    <ShoppingBasket />
                    See All Orders
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {user?.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Users</SidebarGroupLabel>
            <SidebarGroupAction>
              <Plus /> <span className="sr-only">Add User</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/users">
                      <User />
                      See All Users
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Sheet open={AdduserSheet} onOpenChange={setAdduserSheet}>
                      <SheetTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link href="#">
                            <Plus />
                            Add User
                          </Link>
                        </SidebarMenuButton>
                      </SheetTrigger>
                      <AddUser setAdduserSheet={setAdduserSheet} />
                    </Sheet>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {user?.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Handle / Colors</SidebarGroupLabel>
            <SidebarGroupAction>
              <Plus /> <span className="sr-only">Add Color</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/colors">
                      <Palette />
                      See All Colors
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {user?.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Handle / Sizes</SidebarGroupLabel>
            <SidebarGroupAction>
              <Plus /> <span className="sr-only">Add Size</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/sizes">
                      <Footprints />
                      See All Sizes
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user?.name} <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href={`/users/${user?.id}`}>Account</Link>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  {" "}
                  <button className="cursor-pointer" onClick={handleLogout}>
                    Sign out{" "}
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
