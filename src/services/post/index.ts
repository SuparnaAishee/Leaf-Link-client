// "use server";

// import axiosInstance from "@/src/lib/AxiosInstance";
// import { IUpdateVote, TPost } from "@/src/types";
// import { AxiosResponse } from "axios";
// import { revalidateTag } from "next/cache";

// interface ISinglePostResponseType {
//   success: boolean;
//   message: string;
//   data: TPost;
// }

// export const createPost = async (payload: Partial<TPost>) => {
//   try {
//     const { data }: any = await axiosInstance.post(
//       `/posts/create-post`,
//       payload
//     );
//     return data;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };

// export const updatePost = async (payload: any) => {
//   try {
//     const { data }: any = await axiosInstance.put(
//       `/posts/update-post/${payload?.id}`,
//       payload.data
//     );
//     return data;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };

// export const upvoteOrDownvote = async (payload: IUpdateVote) => {
//   try {
//     const { data }: AxiosResponse<ISinglePostResponseType> =
//       await axiosInstance.put(`/posts/vote`, payload);
//     revalidateTag("post");
//     return data;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };

// export const addToBookmark = async (payload: { postId: string }) => {
//   try {
//     const { data }: AxiosResponse<ISinglePostResponseType> =
//       await axiosInstance.put(`/posts/bookmark`, payload);
//     revalidateTag("post");
//     return data;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };

// export const deletePost = async (id: string) => {
//   try {
//     const { data }: AxiosResponse<ISinglePostResponseType> =
//       await axiosInstance.delete(`/posts/${id}`);
//     revalidateTag("post");
//     return data;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };

// export const getSinglePost = async (id: string) => {
//   try {
//     const { data }: AxiosResponse<ISinglePostResponseType> =
//       await axiosInstance.get(`/posts/${id}`);

//     return data;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };

// export const getAllPost = async (query: any) => {
//   try {
//     const params = new URLSearchParams();
//     if (query?.searchTerm) {
//       params.append("searchTerm", query.searchTerm);
//     }
//     if (query?.sort) {
//       params.append("sort", query.sort);
//     }
//     if (query?.filter) {
//       params.append("filter", query.filter);
//     }
//     // if (query?.limit) {
//     //   params.append("limit", query.limit);
//     // }
//     // if (query?.page) {
//     //   params.append("page", query.page);
//     // }

//     const { data }: any = await axiosInstance.get(`/posts`, {
//       params,
//     });

//     return data;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };

// export const getUpvotersForMyPosts = async () => {
//   try {
//     const { data }: any = await axiosInstance.get(`/posts/users/upvoters`);

//     return data;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };
// export const getMyMyPosts = async () => {
//   try {
//     const { data }: any = await axiosInstance.get(`/profile/get-my-post`);

//     return data;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };
"use server";

import { AxiosResponse } from "axios";
import { revalidateTag } from "next/cache";

import axiosInstance from "@/src/lib/AxiosInstance";
import { IUpdateVote, TPost } from "@/src/types";

interface ISinglePostResponseType {
  success: boolean;
  message: string;
  data: TPost;
}

export const createPost = async (payload: Partial<TPost>) => {
  try {
    const { data }: any = await axiosInstance.post(
      `/posts/create-post`,
      payload,
    );

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updatePost = async (payload: any) => {
  try {
    const { data }: any = await axiosInstance.put(
      `/posts/update-post/${payload?.id}`,
      payload.data,
    );

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const upvoteOrDownvote = async (payload: IUpdateVote) => {
  try {
    const { data }: AxiosResponse<ISinglePostResponseType> =
      await axiosInstance.post(`/posts/vote`, payload);

    revalidateTag("post");

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const addToBookmark = async (payload: { postId: string }) => {
  try {
    const { data }: AxiosResponse<ISinglePostResponseType> =
      await axiosInstance.put(`/posts/bookmark`, payload);

    revalidateTag("post");

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deletePost = async (id: string) => {
  try {
    const { data }: AxiosResponse<ISinglePostResponseType> =
      await axiosInstance.delete(`/posts/${id}`);

    revalidateTag("post");

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getSinglePost = async (id: string) => {
  try {
    const { data }: AxiosResponse<ISinglePostResponseType> =
      await axiosInstance.get(`/posts/${id}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getAllPost = async (query: any) => {
  try {
    const params = new URLSearchParams();

    if (query?.searchTerm) {
      params.append("searchTerm", query.searchTerm);
    }
    if (query?.sort) {
      params.append("sort", query.sort);
    }
    if (query?.filter) {
      params.append("filter", query.filter);
    }
    // if (query?.limit) {
    //   params.append("limit", query.limit);
    // }
    // if (query?.page) {
    //   params.append("page", query.page);
    // }

    const { data }: any = await axiosInstance.get(`/posts`, {
      params,
    });

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUpvotersForMyPosts = async () => {
  try {
    const { data }: any = await axiosInstance.get(`/posts/users/upvoters`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const getMyMyPosts = async () => {
  try {
    const { data }: any = await axiosInstance.get(`/profile/get-my-post`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
