"use client"; // Keep this if you are using client-side components
import { useRouter } from "next/navigation"; // Import the useRouter hook
import {
  FaEdit,
  FaShieldAlt,
  FaLock,
  FaUser,
  FaClipboardCheck,
  FaHeart,
} from "react-icons/fa"; // Importing icons

const SettingsPage = () => {
  const router = useRouter(); // Initialize the router

  // Function to navigate to the Profile Update page
  const handleEditProfile = () => {
    router.push("/profile/updateProfile"); // Update the path according to your routing
  };

  // Function to handle keyboard events
  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      handleEditProfile(); // Trigger the click handler on Enter or Space
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-default-black rounded">
      <h2 className="text-3xl font-bold mb-6 text-white">Settings</h2>
      <div className="bg-default-100 shadow-md rounded-lg p-6 w-full h-1/2">
        {/* Edit Profile Section */}
        <div
          aria-label="Edit Profile" // For screen readers
          className="flex items-center cursor-pointer mb-4 hover:bg-gray-200 rounded p-2 transition duration-200"
          role="button" // Adding role to indicate this is a button
          tabIndex={0} // Making it focusable
          onClick={handleEditProfile} // Add click handler
          onKeyPress={handleKeyPress} // Add keyboard handler
        >
          <FaEdit className="text-blue-500 mr-2" />
          <span className="text-lg">Edit Profile</span>
        </div>

        {/* Make Profile Verified Section */}
        <div
          aria-label="Make Profile Verified"
          className="flex items-center cursor-pointer mb-4 hover:bg-gray-200 rounded p-2 transition duration-200"
          role="button"
          tabIndex={0}
          onClick={() => console.log("Make Profile Verified clicked")}
          onKeyPress={(e) =>
            e.key === "Enter" && console.log("Make Profile Verified clicked")
          }
        >
          <FaShieldAlt className="text-green-500 mr-2" />
          <span className="text-lg">Make Profile Verified</span>
        </div>

        {/* Change Password Section */}
        <div
          aria-label="Change Password"
          className="flex items-center cursor-pointer mb-4 hover:bg-gray-200 rounded p-2 transition duration-200"
          role="button"
          tabIndex={0}
          onClick={() => console.log("Change Password clicked")}
          onKeyPress={(e) =>
            e.key === "Enter" && console.log("Change Password clicked")
          }
        >
          <FaLock className="text-yellow-500 mr-2" />
          <span className="text-lg">Change Password</span>
        </div>

        {/* Profile Details Section */}
        <div
          aria-label="Profile Details"
          className="flex items-center cursor-pointer mb-4 hover:bg-gray-200 rounded p-2 transition duration-200"
          role="button"
          tabIndex={0}
          onClick={() => console.log("Profile Details clicked")}
          onKeyPress={(e) =>
            e.key === "Enter" && console.log("Profile Details clicked")
          }
        >
          <FaUser className="text-purple-500 mr-2" />
          <span className="text-lg">Profile Details</span>
        </div>

        {/* Account Status Section */}
        <div
          aria-label="Account Status"
          className="flex items-center cursor-pointer mb-4 hover:bg-gray-200 rounded p-2 transition duration-200"
          role="button"
          tabIndex={0}
          onClick={() => console.log("Account Status clicked")}
          onKeyPress={(e) =>
            e.key === "Enter" && console.log("Account Status clicked")
          }
        >
          <FaClipboardCheck className="text-orange-500 mr-2" />
          <span className="text-lg">Account Status</span>
        </div>

        {/* Favourites Section */}
        <div
          aria-label="Favourites"
          className="flex items-center cursor-pointer mb-4 hover:bg-gray-200 rounded p-2 transition duration-200"
          role="button"
          tabIndex={0}
          onClick={() => console.log("Favourites clicked")}
          onKeyPress={(e) =>
            e.key === "Enter" && console.log("Favourites clicked")
          }
        >
          <FaHeart className="text-red-500 mr-2" />
          <span className="text-lg">Favourites</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
