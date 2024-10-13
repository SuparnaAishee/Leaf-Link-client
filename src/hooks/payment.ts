"use client";

import { useQuery } from "@tanstack/react-query";

import { IResponse } from "../types";
import { IPaymentHistory } from "../types/payment";
import { getPaymentHistory } from "../services/payment";

export const useGetPaymentHistory = () => {
  return useQuery<any, Error, IResponse<IPaymentHistory[]>>({
    queryKey: ["payments"],
    queryFn: async () => await getPaymentHistory(),
  });
};
