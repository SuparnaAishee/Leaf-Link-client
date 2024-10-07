/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";
import { protectedRoutes } from "@/src/constant";
import { useUser } from "@/src/context/user.provider";
import { logout } from "@/src/services/AuthService";
import { Avatar } from "@nextui-org/avatar";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { usePathname, useRouter } from "next/navigation";



const NavbarDropDown = () => {

  const router =useRouter();
  const pathname = usePathname();
  const {user,setIsLoading : userLoading} =useUser();
const handleLogOut = ()=>{
  logout();
  userLoading(true);

  if(protectedRoutes.some((route)=>pathname.match(route))){
    router.push("/")
  }
};
  const handleNavigation =(pathname:string)=>{
    router.push(pathname)
  }
    return (
      <Dropdown>
        <DropdownTrigger>
          <Avatar
            className="cursor-pointer"
            // src="https://res.cloudinary.com/dwelabpll/image/upload/v1728154232/default-profile_nwvfun.png"
            src={user?.profilePhoto}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem onClick={() => handleNavigation("/profile")}>
            Profile
          </DropdownItem>

          <DropdownItem onClick={() => handleNavigation("/profile/settings")}>
            Settings
          </DropdownItem>

          <DropdownItem onClick={() => handleNavigation("/profile/create-post")}>
            Create-Post
          </DropdownItem>

          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            onClick={() => handleLogOut()}
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
};

export default NavbarDropDown;