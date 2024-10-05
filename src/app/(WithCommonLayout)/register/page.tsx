// "use client"
// import LLForm from "@/src/components/form/LLFrom";
// import LLInput from "@/src/components/form/LLInput";

// import registerValidationSchema from "@/src/schemas/register.validation";
// import { registerUser } from "@/src/services/AuthService";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@nextui-org/button";
// import Link from "next/link";
// import { FieldValues, SubmitHandler } from "react-hook-form";

// const RegisterPage = () => {
//   const onSubmit: SubmitHandler<FieldValues> = async (data) => {
//    const userData = {
//      ...data,
//      profilePhoto:
//        "https://res.cloudinary.com/dwelabpll/image/upload/v1727161859/positive-mindset-positive-life-portrait-happy-young-woman-home_590464-22422_pxuwht.avif",
//    };
//    console.log("form user data:",userData)
//     registerUser(userData)
//   };

//   return (
//     <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center">
//       <h3 className="my-2 text-2xl font-bold">Register with LeafLink</h3>
//       <p className="mb-4">Create your account to get started</p>
//       <div className="w-[35%]">
//         <LLForm
//           onSubmit={onSubmit}
//           resolver={zodResolver(registerValidationSchema)}
//         >
//           <div className="py-3">
//             <LLInput label="Full Name" name="name" type="text" />
//           </div>
//           <div className="py-3">
//             <LLInput label="Email" name="email" type="email" />
//           </div>
//           <div className="py-3">
//             <LLInput label="Mobile Number" name="mobileNumber" type="tel" />
//           </div>
//           <div className="py-3">
//             <LLInput label="Password" name="password" type="password" />
//           </div>

//           <Button
//             className="my-3 w-full rounded-md bg-default-900 font-semibold text-default mt-4 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-700 text-white hover:from-purple-400 hover:via-purple-500 hover:to-purple-600 transition duration-300"
//             size="lg"
//             type="submit"
//           >
//             Register
//           </Button>
//         </LLForm>
//         <div className="text-center">
//           Already have an account? <Link href={"/login"}>Login</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;

"use client";
import LLForm from "@/src/components/form/LLFrom";
import LLInput from "@/src/components/form/LLInput";
import { useUserRegistration } from "@/src/hooks/auth.hook";

import registerValidationSchema from "@/src/schemas/register.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";

import Link from "next/link";

import { FieldValues, SubmitHandler } from "react-hook-form";

export default function RegisterPage() {
  const { mutate: handleUserRegistration, isPending } = useUserRegistration();

  //   useEffect(() => {
  //     if (isPending) {
  //       // Handle Loading satate
  //     }
  //   }, [isPending]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const userData = {
      ...data,
      profilePhoto:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    };

    console.log("Inside form user data: ", userData);

    handleUserRegistration(userData);
  };

  if (isPending) {
    //  handle loading state
  }

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center">
      <h3 className="my-2 text-xl font-bold">Register with FoundX</h3>
      <p className="mb-4">Help Lost Items Find Their Way Home</p>
      <div className="w-[35%]">
        <LLForm
          //! Only for development
          // defaultValues={{
          //   name: "Mir Hussain",
          //   email: "mir@gmail.com",
          //   mobileNumber: "01711223344",
          //   password: "123456",
          // }}
          resolver={zodResolver(registerValidationSchema)}
          onSubmit={onSubmit}
        >
          <div className="py-3">
            <LLInput label="Name" name="name" size="sm" />
          </div>
          <div className="py-3">
            <LLInput label="Email" name="email" size="sm" />
          </div>
          <div className="py-3">
            <LLInput label="Mobile Number" name="mobileNumber" size="sm" />
          </div>
          <div className="py-3">
            <LLInput
              label="Password"
              name="password"
              size="sm"
              type="password"
            />
          </div>

          <Button
            className="my-3 w-full rounded-md bg-default-900 font-semibold text-default mt-4 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-700 text-white hover:from-purple-400 hover:via-purple-500 hover:to-purple-600 transition duration-300"
            size="lg"
            type="submit"
          >
            Registration
          </Button>
        </LLForm>
        <div className="text-center">
          Already have an account ? <Link href={"/login"}>Login</Link>
        </div>
      </div>
    </div>
  );
}