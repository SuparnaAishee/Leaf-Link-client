

"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

import { useUser } from "@/src/context/user.provider"; // Assuming this is your context

const VerifyProfile = () => {
  const { user, setUser } = useUser(); // Get user and setUser from the context
  const [loading, setLoading] = useState<number>(0); // State to handle loading

  // Handle Payment process
  const handlePayment = async (amount: number) => {
    setLoading(amount); // Set loading based on the amount (you can customize this)

    const payload = {
      amount,
      user: user?._id, // Assume user object has _id property
    };

    try {
      // Initiating payment by sending payload to the backend
      const response = await fetch(
        "https://gardening-tips-platform-server-three.vercel.app/api/verify-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json(); // Parse the response JSON

      setLoading(0); // Stop loading once the response is received

      if (data?.success) {
        const paymentUrl = data?.data?.payment_url;
        const transactionId = data?.data?.transactionId;

        if (paymentUrl) {
          // Redirect to the payment gateway if payment URL is available
          window.location.href = paymentUrl;

          // After successful payment, update the user status in the backend
          await fetch(
            `https://gardening-tips-platform-server-three.vercel.app/api/users/update-user/${user?._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                isVerified: true, // Update the isVerified status
                premiumStatus: true, // Update the premiumStatus
              }),
            }
          );

          // Update the user state on the frontend after the backend update
          // @ts-ignore
          setUser({
            ...user,
            isVerified: true,
            premiumStatus: true,
          });
        } else {
          console.error("Payment URL is undefined");
        }
      } else {
        console.error("Error fetching payment URL:", data?.message);
      }
    } catch (error) {
      setLoading(0); // Stop loading on error
      console.error("Error during payment request:", error);
    }
  };

  return (
    <div>
      <div className="container-box md:flex items-center justify-between gap-10 space-y-10 md:space-y-0">
        {/* Premium Access Card */}
        <Card className="pt-4 w-full">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-success uppercase font-bold">Premium</p>
            <p className="text-default-500">1 month access!</p>
            <h4 className="font-bold text-large">What we provide?</h4>
          </CardHeader>
          <CardBody className="overflow-visible py-10">
            <div className="flex items-center">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Chip
                    color="success"
                    size="sm"
                    startContent={<CheckIcon size={18} />}
                    variant="light"
                  />
                  <p>Access premium content!</p>
                </div>
                <div className="flex items-center gap-2">
                  <Chip
                    color="success"
                    size="sm"
                    startContent={<CheckIcon size={18} />}
                    variant="light"
                  />
                  <p>Post premium content!</p>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="font-bold text-3xl">$100</h1>
              </div>
            </div>
          </CardBody>
          <CardFooter className="bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
            {/* Button to trigger the payment process */}
            <Button
              isLoading={loading === 100}
              onClick={() => handlePayment(100)}
            >
              Get Access
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyProfile;

// "use client";

// import { useUser } from "@/src/context/user.provider";
// import { useVerifyProfile } from "@/src/hooks/profile";
// import { Button } from "@nextui-org/button";
// import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
// import { Chip } from "@nextui-org/chip";

// import { CheckIcon } from "lucide-react";
// import { useState } from "react";

// const VerifyProfile = () => {
//   const { user } = useUser();
//   const [loading, setLoading] = useState(0);
//   const { mutate: handleVerifyProfile } = useVerifyProfile();

//   const handlePayment = (amount: number) => {
//     setLoading(amount);
//     const payload = {
//       amount,
//       user: user?._id,
//     };
//     handleVerifyProfile(payload, {
//       onSuccess(data) {
//         setLoading(0);
//         if (data?.success) {
//           window.location.href = data?.data?.payment_url;
//         }
//       },
//       onError() {
//         setLoading(0);
//       },
//     });
//   };
//   return (
//     <div>
//       <div className="container-box  md:flex items-center justify-between gap-10 space-y-10 md:space-y-0">
//         <Card className="pt-4 w-full">
//           <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
//             <p className="text-success uppercase font-bold">Premium</p>
//             <p className="text-default-500">1 month access!</p>
//             <h4 className="font-bold text-large">What we provide ?</h4>
//           </CardHeader>
//           <CardBody className="overflow-visible py-10">
//             <div className="flex items-center">
//               <div className="space-y-2 flex-1">
//                 <div className="flex items-center gap-2">
//                   <Chip
//                     startContent={<CheckIcon size={18} />}
//                     variant="light"
//                     color="success"
//                     size="sm"
//                   />
//                   <p>Access premium content!</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Chip
//                     startContent={<CheckIcon size={18} />}
//                     variant="light"
//                     color="success"
//                     size="sm"
//                   />
//                   <p>Post premium content!</p>
//                 </div>
//               </div>
//               <div className="flex-1">
//                 <h1 className="font-bold text-3xl">$100</h1>
//               </div>
//             </div>
//           </CardBody>
//           <CardFooter className=" bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
//             <Button
//               isLoading={loading === 100}
//               onClick={() => handlePayment(100)}
//             >
//               Get Access
//             </Button>
//           </CardFooter>
//         </Card>
//         {/* <Card className="pt-4 w-full">
//           <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
//             <p className="text-success uppercase font-bold">Premium</p>
//             <p className="text-default-500">6 month access!</p>
//             <h4 className="font-bold text-large">What we provide ?</h4>
//           </CardHeader>
//           <CardBody className="overflow-visible py-10">
//             <div className="flex items-center">
//               <div className="space-y-2 flex-1">
//                 <div className="flex items-center gap-2">
//                   <Chip
//                     startContent={<CheckIcon size={18} />}
//                     variant="light"
//                     color="success"
//                     size="sm"
//                   />
//                   <p>Access premium content!</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Chip
//                     startContent={<CheckIcon size={18} />}
//                     variant="light"
//                     color="success"
//                     size="sm"
//                   />
//                   <p>Post premium content!</p>
//                 </div>
//               </div>
//               <div className="flex-1">
//                 <h1 className="font-bold text-3xl">$300</h1>
//               </div>
//             </div>
//           </CardBody>
//           <CardFooter className=" bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
//             <Button
//               isLoading={loading === 300}
//               onClick={() => handlePayment(300)}
//             >
//               Get Access
//             </Button>
//           </CardFooter>
//         </Card> */}
//       </div>
//     </div>
//   );
// };

// export default VerifyProfile;
