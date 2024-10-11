/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { FieldValues, SubmitHandler } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@nextui-org/input";

import { useGetSInglePost, useUpdatePost } from "@/src/hooks/post";
import { useUser } from "@/src/context/user.provider";
import { useQueryClient } from "@tanstack/react-query";
import { useShowUpdatePostModal } from "@/src/store/updatePostModal";

import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";
import { useGetMe } from "@/src/hooks/profile";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";
import Editor from "../UI/Editor/Editor";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
interface IProps {
  postId: string;
  setPostId: Dispatch<SetStateAction<string>>;
}
const UpdatePost = ({ postId, setPostId }: IProps) => {
  const [imagePreview, setImagePreview] = useState("");
  const { mutate: updatePost } = useUpdatePost();
  const { data: singlePost } = useGetSInglePost(postId);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useShowUpdatePostModal();
  const [image, setImage] = useState<File>();
  const { query, user } = useUser();
  const { data: me } = useGetMe(user?.email as string);
  const [content, setContent] = useState(``);
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
    let postData: any = {
      id: singlePost?.data?._id,
      data: {
        ...data,
        content,
      },
    };
    if (image) {
      const imageUrl = await uploadToCloudinary(image as File, "image");
      postData.data.imageUrl = imageUrl;
    }

    updatePost(postData, {
      onSuccess() {
        setLoading(false);
        queryClient.invalidateQueries({ queryKey: [`GET_ALL_POST`, query] });
        setShowModal(false);
      },
      onError() {
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    if (singlePost?.data) {
      setContent(singlePost?.data?.content);
      reset({
        title: singlePost?.data?.title,
        category: singlePost?.data?.category,
        description: singlePost?.data?.description,
        isPremium: singlePost?.data?.isPremium,
      });
    }
  }, [singlePost]);

  if (!singlePost?.data) {
    return null;
  }

  const closeModal = () => {
    setPostId("");
    setShowModal(false);
  };

  return (
    <>
      <Modal
        size="5xl"
        scrollBehavior="inside"
        isOpen={showModal}
        onOpenChange={closeModal}
        placement="top-center"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex  items-center gap-10">
                    <h1>Update This Post</h1>
                    {uploadingImage && (
                      <p className="flex items-center gap-2 text-sm">
                        <span> Uploading Image</span> <Spinner size="sm" />
                      </p>
                    )}
                  </div>
                </ModalHeader>

                <ModalBody>
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

                    {!imagePreview && singlePost?.data?.imageUrl && (
                      <div className="relative rounded-xl h-[300px] border-2 border-dashed border-default-300 p-2">
                        <img
                          alt="item"
                          className="h-full w-full object-cover object-center rounded-md"
                          src={singlePost?.data?.imageUrl}
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
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={closeModal}>
                    Close
                  </Button>
                  <Button isLoading={loading} type="submit" color="primary">
                    Update Post
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default UpdatePost;
