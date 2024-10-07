import axios from "axios";

export const uploadToCloudinary = async (file: File, type: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "LeafLink"); // Set your Cloudinary upload preset

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dwelabpll/${type}/upload`, // Use the type (image or video)
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};
