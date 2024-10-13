import dynamic from "next/dynamic";

const ProfileUpdate = dynamic(
  () => import("@/src/components/UI/ProfileUpdate/ProfileUpdate"),
  {
    ssr: false,
  },
);

const UpdateProfile = () => {
  return <ProfileUpdate />;
};

export default UpdateProfile;
