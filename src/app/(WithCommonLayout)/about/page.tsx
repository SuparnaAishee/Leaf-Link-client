import ContactForm from "@/src/components/UI/contactus";
import React from "react";
import { FaSeedling, FaEye } from "react-icons/fa";
const AboutPage = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen  ">
      <div className="max-w-6xl w-full  shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-purple-500 text-center mb-4">
          About Us
        </h1>
        <p className="text-lg mb-4">
          At the <strong>Gardening Tips & Advice Platform</strong>, we believe
          that gardening is not just a hobby; it’s a way of life that brings
          joy, relaxation, and a deep connection to nature. Our platform is
          dedicated to empowering gardening enthusiasts—from beginners to
          seasoned professionals—by providing a space where they can share
          knowledge, explore new ideas, and cultivate a vibrant gardening
          community.
        </p>

        <div className="pt-20 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Our Mission Card */}
          <div className="bg-default rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center mb-4">
              <FaSeedling className="text-green-500 text-4xl mr-3" />
              <h2 className="text-2xl font-semibold text-purple-600">
                Our Mission
              </h2>
            </div>
            <p>
              Our mission is to create an inclusive and supportive environment
              where gardeners can discover valuable insights, exchange advice,
              and inspire one another. We aim to transform gardening from a
              solitary activity into a community-driven experience by
              facilitating meaningful interactions and sharing expertise.
            </p>
          </div>

          {/* Our Vision Card */}
          <div className=" bg-default rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center mb-4">
              <FaEye className="text-blue-500 text-4xl mr-3" />
              <h2 className="text-2xl font-semibold text-purple-600">
                Our Vision
              </h2>
            </div>
            <p>
              We envision a world where every gardener has access to the best
              tips, advice, and tools to nurture their passion for gardening.
              Through our platform, we strive to enhance the gardening
              experience by integrating advanced technology with rich content
              and social engagement.
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-purple-600 mt-20 mb-2">
          What We Offer
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <img
              src="https://res.cloudinary.com/dwelabpll/image/upload/v1728055736/1620319892_kfgw3v.png"
              alt="Expert Tips"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-purple-600">
                Expert Tips & Guides
              </h3>
              <p className="text-gray-700">
                Explore an extensive collection of gardening tips, plant care
                advice, and seasonal guides.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <img
              src="https://res.cloudinary.com/dwelabpll/image/upload/v1728055810/1605885676857_lpchdt.jpg"
              alt="Interactive Community"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-purple-600">
                Interactive Community
              </h3>
              <p className="text-gray-700">
                Join a vibrant community of gardeners! Share your experiences
                and engage with others.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <img
              src="https://res.cloudinary.com/dwelabpll/image/upload/v1728055874/1621875021927_bmw9t9.jpg"
              alt="Rich Content Creation"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-purple-600">
                Rich Content Creation
              </h3>
              <p className="text-gray-700">
                Utilize our rich text editor to create and share your gardening
                tips and guides.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <img
              src="https://res.cloudinary.com/dwelabpll/image/upload/v1728055967/What-is-Premium-Content-1_z3bmoz.jpg"
              alt="Premium Content Access"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-purple-600">
                Premium Content Access
              </h3>
              <p className="text-gray-700">
                Unlock exclusive content with our premium features.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <img
              src="https://res.cloudinary.com/dwelabpll/image/upload/v1728056034/user-interface-development-team-design-discussions-thumbnail_mq67dl.webp"
              alt="User-Friendly Interface"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-purple-600">
                User-Friendly Interface
              </h3>
              <p className="text-gray-700">
                Enjoy a seamless experience that adapts to your needs across
                devices.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-purple-600 mt-20 mb-2">
          Join Us Today
        </h2>
        <p className="mb-4">
          Whether you&apos;re looking to learn new gardening techniques, share
          your knowledge, or connect with fellow gardening enthusiasts, the{" "}
          <strong>Gardening Tips & Advice Platform</strong> is your go-to
          resource. Join us today and become part of a growing community that
          celebrates the art and science of gardening!
        </p>

        <h2 className="text-2xl font-semibold text-purple-600 mt-20 mb-2">
          Contact Us
        </h2>
        <p className="mb-4">
          We’d love to hear from you! If you have any questions or feedback,
          feel free to reach out to us through our <strong>Contact Us</strong>{" "}
          page. Together, let’s grow our gardening community!
        </p>
      </div>
    </section>
  );
};

export default AboutPage;
