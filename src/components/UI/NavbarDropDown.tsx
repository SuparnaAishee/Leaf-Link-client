"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Avatar } from "@nextui-org/avatar";
import { usePathname, useRouter } from "next/navigation";
import {
  Crown,
  History,
  LogOut,
  PenSquare,
  ShieldCheck,
  Sparkles,
  Sprout,
  Star,
  User,
} from "lucide-react";

import { protectedRoutes } from "@/src/constant";
import { useUser } from "@/src/context/user.provider";
import { useGetMe } from "@/src/hooks/profile";
import { logout } from "@/src/services/AuthService";

const NavbarDropDown = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setIsLoading: userLoading } = useUser();
  const { data: meResponse } = useGetMe(user?.email as string);
  const me = meResponse?.data;

  const isAdmin = (me?.role || user?.role) === "ADMIN";
  const isPremium = me?.premiumStatus ?? user?.premiumStatus ?? false;

  const handleLogOut = () => {
    logout();
    userLoading(true);
    if (protectedRoutes.some((route) => pathname.match(route))) {
      router.push("/");
    }
  };

  const go = (href: string) => router.push(href);

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          className="cursor-pointer"
          src={user?.profilePhoto || undefined}
          name={user?.name}
          size="sm"
        />
      </DropdownTrigger>

      <DropdownMenu aria-label="Profile actions" className="w-64">
        <DropdownSection
          title={user?.name ? `Signed in as ${user.name}` : "Account"}
          showDivider
        >
          <DropdownItem
            key="profile"
            startContent={<User className="w-4 h-4" />}
            onClick={() => go("/profile")}
          >
            View profile
          </DropdownItem>
          <DropdownItem
            key="edit"
            startContent={<PenSquare className="w-4 h-4" />}
            onClick={() => go("/profile/updateProfile")}
          >
            Edit profile
          </DropdownItem>
        </DropdownSection>

        <DropdownSection title="My garden" showDivider>
          <DropdownItem
            key="my-garden"
            startContent={<Sprout className="w-4 h-4 text-green-600" />}
            onClick={() => go("/my-garden")}
          >
            My Garden
          </DropdownItem>
          <DropdownItem
            key="ai"
            startContent={<Sparkles className="w-4 h-4 text-green-500" />}
            onClick={() => go("/ai-garden")}
          >
            AI Plant Doctor
          </DropdownItem>
          <DropdownItem
            key="ai-history"
            startContent={<History className="w-4 h-4 text-emerald-500" />}
            onClick={() => go("/ai-garden/history")}
          >
            Scan history
          </DropdownItem>
        </DropdownSection>

        <DropdownSection title="Premium" showDivider>
          {(isPremium ? (
            <DropdownItem
              key="premium-content"
              startContent={<Star className="w-4 h-4 text-amber-500" />}
              onClick={() => go("/profile/premiumContent")}
            >
              Premium content
            </DropdownItem>
          ) : (
            <DropdownItem
              key="go-premium"
              startContent={<Crown className="w-4 h-4 text-amber-500" />}
              onClick={() => go("/profile/verify-profile")}
            >
              Go Premium
            </DropdownItem>
          )) as any}
        </DropdownSection>

        {(isAdmin ? (
          <DropdownSection showDivider>
            <DropdownItem
              key="admin"
              startContent={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
              onClick={() => go("/admin")}
            >
              Admin dashboard
            </DropdownItem>
          </DropdownSection>
        ) : null) as any}

        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          startContent={<LogOut className="w-4 h-4" />}
          onClick={handleLogOut}
        >
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default NavbarDropDown;
