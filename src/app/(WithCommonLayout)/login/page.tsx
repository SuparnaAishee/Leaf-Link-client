// "use client";

// import LLForm from "@/src/components/form/LLFrom";
// import LLInput from "@/src/components/form/LLInput";
// import { loginValidationSchema } from "@/src/schemas/login.validation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@nextui-org/button";
// import { Card } from "@nextui-org/card";
// import Link from "next/link";
// import { FieldValues, SubmitHandler } from "react-hook-form";

// const LoginPage = () => {
//   const onSubmit: SubmitHandler<FieldValues> = (data) => {
//     console.log(data);
//   };

//   return (
//     <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center ">
//       <h3 className="my-2 text-2xl font-bold">Login with LeafLink</h3>
//       <p className="mb-4">Welcome Back! Let&lsquo;s Get Started</p>
//       <div className="w-[35%]">
//         <LLForm
//           onSubmit={onSubmit}
//           resolver={zodResolver(loginValidationSchema)}
//         >
//           <div className="py-3">
//             <LLInput name="email" label="Email" type="email" />
//           </div>
//           <div className="py-3">
//             <LLInput name="password" label="Password" type="password" />
//           </div>

//           <Button
//             className="my-3 w-full rounded-md bg-default-900 font-semibold text-default mt-4 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-700 text-white hover:from-purple-400 hover:via-purple-500 hover:to-purple-600 transition duration-300"
//             size="lg"
//             type="submit"
//           >
//             LogIn
//           </Button>
//         </LLForm>
//         <div className="text-center">
//           Don&lsquo;t have account ? <Link href={"/register"}>Register</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

"use client";

import LLForm from "@/src/components/form/LLFrom";
import LLInput from "@/src/components/form/LLInput";
import { loginValidationSchema } from "@/src/schemas/login.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import Link from "next/link";

import { FieldValues, SubmitHandler } from "react-hook-form";

const LoginPage = () => {
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };

  return (
    <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center">
      <h3 className="my-2 text-2xl font-bold">Login with LeafLink</h3>
      <p className="mb-4">Welcome Back! Let&lsquo;s Get Started</p>
      <div className="w-[35%]">
        <LLForm
          onSubmit={onSubmit}
          resolver={zodResolver(loginValidationSchema)}
        >
          <div className="py-3">
            <LLInput name="email" label="Email" type="email" />
          </div>
          <div className="py-3">
            <LLInput name="password" label="Password" type="password" />
          </div>

          <Button
            className="my-3 w-full rounded-md bg-default-900 font-semibold text-default mt-4 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-700 text-white hover:from-purple-400 hover:via-purple-500 hover:to-purple-600 transition duration-300"
            size="lg"
            type="submit"
          >
            Login
          </Button>
        </LLForm>
        <div className="text-center">
          Don&lsquo;t have account ? <Link href={"/register"}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;