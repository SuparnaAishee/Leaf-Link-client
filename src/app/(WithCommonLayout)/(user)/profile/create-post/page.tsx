

/* eslint-disable jsx-a11y/label-has-associated-control */
"use client"; // This directive makes this component a client component

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Page = () => {
  const [description, setDescription] = useState(""); // State for rich text
  const [imageFile, setImageFile] = useState<File | null>(null); // State for image file

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setImageFile(file); // Set the selected image file
    }
  };

  return (
    <div className="container mx-auto p-4  rounded-md">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>

      <Formik
        initialValues={{
          title: "",
          category: "",
        }}
        onSubmit={(values) => {
          // handle form submit here
          console.log({ ...values, description, imageFile });
          // Add logic to upload image file if needed
        }}
      >
        {({ values, handleChange }) => (
          <Form className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <Field
                id="title"
                name="title"
                type="text"
                placeholder="Enter post title"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <Field
                id="category"
                name="category"
                type="text"
                placeholder="Enter post category"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {imageFile && (
                <p className="mt-2 text-sm">File: {imageFile.name}</p>
              )}
            </div>

            {/* Description (Rich Text Editor) */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Description
              </label>
              <ReactQuill
                value={description}
                onChange={setDescription}
                placeholder="Write your post description here..."
                className="mt-2"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
            >
              Post
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Page;
