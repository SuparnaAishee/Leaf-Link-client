"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@nextui-org/avatar"; // Import Avatar if needed
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Input } from "@nextui-org/input";

import { searchUsers } from "@/src/services/search/search";
import { TUser } from "@/src/types";

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (term: string) => {
    if (term.trim() === "") {
      setResults([]);

      return;
    }

    setLoading(true);
    try {
      const response = await searchUsers(term); // Call your search API

      setResults(response.data); // Assuming the API returns an array of user data
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Input
          aria-label="Search"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Search Results">
        {loading ? (
          <DropdownItem>Loading...</DropdownItem>
        ) : results.length > 0 ? (
          results.map((user: TUser) => (
            <DropdownItem key={user._id} onClick={() => console.log(user)}>
              <Avatar
                alt={user.name} // Make sure to have alt text for accessibility
                className="mr-2"
                src={user.profilePhoto}
              />
              {user.name} {/* Adjust based on your user object structure */}
            </DropdownItem>
          ))
        ) : (
          <DropdownItem>No results found</DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserSearch;
