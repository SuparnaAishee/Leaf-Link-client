import { Home, Info, User, PlusSquare, Search } from "lucide-react"; // ✅ Updated Create Post icon

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
      icon: Home,
      // bgColor: "bg-default-100", // Example background color
    },
    {
      label: "About",
      href: "/about",
      icon: Info,
      // bgColor: "bg-default-100",
    },
    {
      label: "Author",
      href: "/author",
      icon: User,
      // bgColor: "bg-default-100",
    },
    {
      label: "Create Post",
      href: "/profile/create-post",
      icon: PlusSquare, // ✅ Updated to Instagram-style icon
      // bgColor: "bg-default-100",
    },
    {
      label: "Search User",
      href: "/profile/searchUser",
      icon: Search,
      // bgColor: "bg-default-100",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
};
