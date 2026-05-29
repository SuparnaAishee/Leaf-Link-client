import {
  Home,
  Info,
  User,
  PlusSquare,
  Sparkles,
  Bell,
} from "lucide-react";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "LeafLink",
  description: "The social network for gardeners.",
  navItems: [
    { label: "Home", href: "/", icon: Home },
    { label: "About", href: "/about", icon: Info },
    { label: "Create Post", href: "/profile/create-post", icon: PlusSquare },
  ],
  navMenuItems: [
    { label: "Home", href: "/", icon: Home },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Create Post", href: "/profile/create-post", icon: PlusSquare },
    { label: "AI Plant Doctor", href: "/ai-garden", icon: Sparkles },
    { label: "Profile", href: "/profile", icon: User },
    { label: "About", href: "/about", icon: Info },
  ],
};
