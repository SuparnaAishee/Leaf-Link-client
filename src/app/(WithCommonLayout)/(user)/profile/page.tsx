"use client"; // Keep this if you are using client-side components
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHeart,
  FaRegComment,
  FaEdit,
  FaTrash,
  FaFilePdf,
} from "react-icons/fa";
import { Avatar } from "@nextui-org/avatar";
import html2pdf from "html2pdf.js"; // Importing html2pdf

import { getCurrentUser } from "@/src/services/AuthService"; // Adjust path if needed
import { TPost } from "@/src/types/post";

const MyPostsPage = () => {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: string]: boolean;
  }>({});

  // Fetch posts for the logged-in user
  const fetchMyPosts = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || !user._id) {
        setError("User is not authenticated.");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/posts/user/${user._id}`
      );
      if (response.data.success) {
        setPosts(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Failed to fetch posts. Please try again later.");
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const toggleExpand = (postId: string) => {
    setExpandedPosts((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  // Function to generate PDF
  const generatePDF = (postId: string) => {
    const postElement = document.getElementById(`post-${postId}`);
    if (!postElement) return;

    // Create a separate element for PDF content
    const pdfContent = document.createElement("div");

    // Prepare the inner HTML with styles and content
    const title = postElement.querySelector("h3")?.innerText || "No Title";
    const description =
      postElement.querySelector("p")?.innerText || "No Description";
    const imageUrl = postElement.querySelector("img")?.src || ""; // Get the image source

    pdfContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; color: black; padding: 20px;">
        <h3 style="margin: 0;">${title}</h3>
        ${imageUrl ? `<img src="${imageUrl}" style="width:100%; height:auto; margin-bottom: 15px;"/>` : ""}
        <p style="margin: 0;">${description}</p>
      </div>
    `;

    // Append the pdfContent to the body for rendering
    document.body.appendChild(pdfContent);

    const options = {
      margin: 0.5,
      filename: `${postId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // Generate PDF from the created content
    html2pdf()
      .from(pdfContent)
      .set(options)
      .save()
      .then(() => {
        console.log("PDF generated successfully");
        // Remove pdfContent after generation
        document.body.removeChild(pdfContent);
      })
      .catch((err: any) => {
        console.error("Error generating PDF:", err);
      });
  };

  return (
    <div className="pl-8">
      <h2 className="text-2xl font-bold mb-8 text-purple-500">My Posts</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            id={`post-${post._id}`} // Unique ID for each post
            className="bg-default-black text-default-white shadow-lg rounded-lg p-4 mb-6 border border-gray-400 max-w-xl w-full"
          >
            <div className="p-4 bg-default-black rounded-md">
              <div className="flex items-center mb-5">
                <Avatar
                  src={post.user.profilePhoto || "/default-avatar.png"}
                  alt={`${post.user.name}'s profile photo`}
                  size="lg"
                  className="mr-4"
                />
                <div>
                  <h4 className="font-bold">{post.user.name || "Anonymous"}</h4>
                  <p className="text-sm text-gray-400">Just now</p>
                </div>
              </div>

              {post.imageUrl && (
                <div className="mb-4">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-56 object-cover rounded-lg"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}

              <h3 className="text-lg font-bold mb-2">{post.title}</h3>

              <p className="text-default-gray mb-6">
                {expandedPosts[post._id]
                  ? post.description
                  : `${post.description.substring(0, 100)}...`}{" "}
                <button
                  className="text-blue-400 cursor-pointer focus:outline-none"
                  onClick={() => toggleExpand(post._id)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && toggleExpand(post._id)
                  }
                  aria-expanded={expandedPosts[post._id] ? "true" : "false"}
                >
                  {expandedPosts[post._id] ? "See Less" : "See More"}
                </button>
              </p>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <FaHeart className="text-red-500" />
                    <span>{post.likes ? post.likes.length : 0}</span>{" "}
                    {/* Safely handle undefined likes */}
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaRegComment />
                    <span>{post.comments ? post.comments.length : 0}</span>{" "}
                    {/* Adjust as needed */}
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <FaEdit
                    className="cursor-pointer text-blue-500"
                    title="Edit Post"
                  />
                  <FaTrash
                    className="cursor-pointer text-red-500"
                    title="Delete Post"
                  />
                  <FaFilePdf
                    className="cursor-pointer text-green-500"
                    title="Download PDF"
                    onClick={() => generatePDF(post._id)} // Call PDF generation function
                  />
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default MyPostsPage;
