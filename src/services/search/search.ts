// src/services/UserServices.ts
import axios from "axios";

// Function to search users by name
export const searchUsers = async (query: string) => {
  if (!query) return []; // return an empty array if no query is provided

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API}/users`,
      {
        params: {
          q: query, // Pass the query to the backend
        },
      }
    );
    return response.data; // Assuming your API returns the user list in `data`
  } catch (error) {
    console.error("Error searching users:", error);
    return []; // Return an empty array in case of an error
  }
};
