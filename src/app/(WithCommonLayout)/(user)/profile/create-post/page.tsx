

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
import { useCreatePost } from "@/src/hooks/post";
import { useUser } from "@/src/context/user.provider";
import { useQueryClient } from "@tanstack/react-query";
// eslint-disable-next-line import/order

import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";
import { useGetMe } from "@/src/hooks/profile";
import Editor from "@/src/components/UI/Editor/Editor";
import { Button } from "@nextui-org/button";

const CreatePost = () => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState("");
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
    <div>
      <h1>Create a Post</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-10">
          {uploadingImage && (
            <p className="flex items-center gap-2 text-sm">
              <span>Uploading Image</span> <Spinner size="sm" />
            </p>
          )}
        </div>

        <Editor
          setUploadingImage={setUploadingImage}
          content={content}
          setContent={setContent}
        />
        <div className="mt-5 space-y-3">
          <Input
            {...register("title", { required: true })}
            label="Title"
            name="title"
            type="text"
          />
          <Input
            {...register("category", { required: true })}
            label="Category"
            name="category"
            type="text"
          />
          <Input
            onChange={handleImageChange}
            name="imageUrl"
            type="file"
          />
          {imagePreview && (
            <div className="relative rounded-xl h-[300px] border-2 border-dashed border-default-300 p-2">
              <img
                alt="item"
                className="h-full w-full object-cover object-center rounded-md"
                src={imagePreview}
              />
            </div>
          )}
          <Input
            {...register("description")}
            label="Description"
            name="description"
            type="textarea"
          />

          {me?.data?.isVerified && me?.data?.premiumStatus && (
            <div className="flex items-center justify-between">
              <Checkbox {...register("isPremium")} color="success">
                Premium
              </Checkbox>
            </div>
          )}
        </div>

        <div className="mt-5">
          <Button isLoading={loading} type="submit" color="primary">
            Create Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
