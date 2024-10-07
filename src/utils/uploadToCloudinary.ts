import axios from "axios";

export const uploadToCloudinary = async (file: File, type: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "LeafLink");
  formData.append("cloud_name", "dwelabpll");

  try {
    // https://api.cloudinary.com/v1_1/daar91zv4/upload
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dwelabpll/upload",
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};
