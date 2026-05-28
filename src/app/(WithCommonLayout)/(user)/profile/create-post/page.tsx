// /* eslint-disable jsx-a11y/label-has-associated-control */
// "use client"; // This directive makes this component a client component

// import { useState } from "react";
// import { Formik, Form, Field } from "formik";
// import dynamic from "next/dynamic";
// import "react-quill/dist/quill.snow.css";

// // Dynamically import ReactQuill
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// const Page = () => {
//   const [description, setDescription] = useState(""); // State for rich text
//   const [imageFile, setImageFile] = useState<File | null>(null); // State for image file

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.currentTarget.files?.[0];
//     if (file) {
//       setImageFile(file); // Set the selected image file
//     }
//   };

//   return (
//     <div className="container mx-auto p-4  rounded-md">
//       <h1 className="text-2xl font-bold mb-4">Create New Post</h1>

//       <Formik
//         initialValues={{
//           title: "",
//           category: "",
//         }}
//         onSubmit={(values) => {
//           // handle form submit here
//           console.log({ ...values, description, imageFile });
//           // Add logic to upload image file if needed
//         }}
//       >
//         {({ values, handleChange }) => (
//           <Form className="space-y-4">
//             {/* Title */}
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium">
//                 Title
//               </label>
//               <Field
//                 id="title"
//                 name="title"
//                 type="text"
//                 placeholder="Enter post title"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* Category */}
//             <div>
//               <label htmlFor="category" className="block text-sm font-medium">
//                 Category
//               </label>
//               <Field
//                 id="category"
//                 name="category"
//                 type="text"
//                 placeholder="Enter post category"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* Image Upload */}
//             <div>
//               <label className="block text-sm font-medium">Upload Photo</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//               {imageFile && (
//                 <p className="mt-2 text-sm">File: {imageFile.name}</p>
//               )}
//             </div>

//             {/* Description (Rich Text Editor) */}
//             <div>
//               <label
//                 htmlFor="description"
//                 className="block text-sm font-medium"
//               >
//                 Description
//               </label>
//               <ReactQuill
//                 value={description}
//                 onChange={setDescription}
//                 placeholder="Write your post description here..."
//                 className="mt-2"
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
//             >
//               Post
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default Page;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import { Spinner } from "@nextui-org/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@nextui-org/button";

import { useCreatePost } from "@/src/hooks/post";
import { useUser } from "@/src/context/user.provider";
// eslint-disable-next-line import/order

import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";
import { useGetMe } from "@/src/hooks/profile";
import Editor from "@/src/components/UI/Editor/Editor";

const CreatePost = () => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState("");
  // @ts-ignore

  const { user, query } = useUser();
  const [content, setContent] = useState("");
  const { data: me } = useGetMe(user?.email as string);
  const { mutate: createPost } = useCreatePost();
  const { register, handleSubmit, reset } = useForm();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const image = URL.createObjectURL(e.target.files[0]);

      setImage(e.target.files[0]);
      setImagePreview(image);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    const postData: any = {
      user: user?._id,
      ...data,
      content,
    };

    if (image) {
      const imageUrl = await uploadToCloudinary(image as File, "image");

      postData.imageUrl = imageUrl;
    }

    createPost(postData, {
      onSuccess() {
        reset();
        setContent("");
        setLoading(false);
        setImagePreview("");
        queryClient.invalidateQueries({ queryKey: [`GET_ALL_POST`, query] });
      },
      onError() {
        setLoading(false);
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Create a Post</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Share your gardening tips with the community</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Upload Status */}
          {uploadingImage && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Spinner size="sm" color="success" />
              <span>Uploading Image...</span>
            </div>
          )}

          {/* Rich Text Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <Editor
                content={content}
                setContent={setContent}
                setUploadingImage={setUploadingImage}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <Input
              {...register("title", { required: true })}
              label="Title"
              name="title"
              type="text"
              variant="bordered"
              classNames={{
                inputWrapper: "border-gray-200 dark:border-gray-700",
              }}
            />
            <Input
              {...register("category", { required: true })}
              label="Category"
              name="category"
              type="text"
              variant="bordered"
              placeholder="e.g., Herbs, Vegetables, Flowers"
              classNames={{
                inputWrapper: "border-gray-200 dark:border-gray-700",
              }}
            />

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Image
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 hover:border-green-500 dark:hover:border-green-500 transition-colors">
                <input
                  name="imageUrl"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 dark:file:bg-green-900/30 file:text-green-600 dark:file:text-green-400 hover:file:bg-green-100 dark:hover:file:bg-green-900/50 cursor-pointer"
                />
              </div>
              {imagePreview && (
                <div className="relative mt-3 rounded-xl h-[250px] overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    alt="Preview"
                    className="h-full w-full object-cover object-center"
                    src={imagePreview}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(undefined);
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <Input
              {...register("description")}
              label="Short Description"
              name="description"
              type="text"
              variant="bordered"
              placeholder="A brief summary of your post"
              classNames={{
                inputWrapper: "border-gray-200 dark:border-gray-700",
              }}
            />

            {/* Premium Option */}
            {me?.data?.isVerified && me?.data?.premiumStatus && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <Checkbox {...register("isPremium")} color="warning">
                  <span className="text-amber-700 dark:text-amber-400 font-medium">Mark as Premium Content</span>
                </Checkbox>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex items-center gap-3">
            <Button
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold h-12 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
              type="submit"
              isLoading={loading}
            >
              {loading ? "Publishing..." : "Publish Post"}
            </Button>
            <Button
              type="button"
              variant="bordered"
              className="h-12 rounded-xl border-gray-300 dark:border-gray-600"
              onClick={() => {
                reset();
                setContent("");
                setImagePreview("");
              }}
            >
              Clear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
