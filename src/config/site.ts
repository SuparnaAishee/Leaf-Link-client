import {
  Home,
  Info,
  User,
  PlusSquare,
  Sparkles,
  Settings,
} from "lucide-react";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    { label: "Home", href: "/", icon: Home },
    { label: "About", href: "/about", icon: Info },
    { label: "Author", href: "/author", icon: User },
    { label: "Create Post", href: "/profile/create-post", icon: PlusSquare },
  ],
  navMenuItems: [
    { label: "Home", href: "/", icon: Home },
    { label: "Create Post", href: "/profile/create-post", icon: PlusSquare },
    { label: "AI Plant Doctor", href: "/ai-garden", icon: Sparkles },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Settings", href: "/profile/settings", icon: Settings },
    { label: "About", href: "/about", icon: Info },
  ],
};
