"use client";

import { Spinner } from "@nextui-org/spinner";

const Loading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Spinner size="lg" />
    </div>
  );
};

export default Loading;
