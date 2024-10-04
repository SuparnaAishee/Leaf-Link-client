/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";
import { Avatar } from "@nextui-org/avatar";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { useRouter } from "next/navigation";



const NavbarDropDown = () => {

  const router =useRouter();

  const handleNavigation =(pathname:string)=>{
    router.push(pathname)
  }
    return (
      <Dropdown>
        <DropdownTrigger>
          <Avatar className="cursor-pointer" name="Arittra" />
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem onClick={() => handleNavigation("/profile")}>
            Profile
          </DropdownItem>

          <DropdownItem onClick={() => handleNavigation("/settings")}>
            Settings
          </DropdownItem>

          <DropdownItem onClick={() => handleNavigation("/create-post")}>
            Create-Post
          </DropdownItem>

          <DropdownItem key="delete" className="text-danger" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
};

export default NavbarDropDown;