import logo from "../../assets/images/footerLogo.png";
import yt from "../../assets/images/yt.png";
import fb from "../../assets/images/fb.png";
import ins from "../../assets/images/ins.png";
import tw from "../../assets/images/tw.png";
import { Mail, MapPin, Phone } from "lucide-react";
import send from "../../assets/images/send.png";
import { Form, Input } from "antd";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { fireToastMessage } from "../../toastContainer";
import { api } from "../../Config/api";

export default function Footer() {
  const [form] = Form.useForm();
  const { user } = useSelector((s) => s.auth);
  return (
    <div
      className={`py-12 ${
        user._id ? "" : "bg-[#D1F3FF]"
      } flex flex-wrap justify-evenly gap-12 z-40`}
    >
      <div>
        <p className="Livvic max-lg:text-center lg:text-3xl text-2xl font-bold mb-8">
          Contacts
        </p>
        {/* <div className='flex gap-4 items-center'>
                    <img src={phone} alt="phone" />
                    <p className='text-lg'>+ (000) 123456789</p>
                </div>
                <div className='flex gap-4 items-center my-6'>
                    <img src={location} alt="location" />
                    <p className='text-lg'>A-1, Ipsum HQ, Lorem</p>
                </div> */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-4 items-center">
            <div className="bg-[#FFA2BC] lg:p-4 p-2 rounded-full">
              <Phone className="text-white max-lg:size-4" />
            </div>

            <p className="text-lg">+ (000) 123456789</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-[#B996FE] lg:p-4 p-2 rounded-full">
              <MapPin className="text-white max-lg:size-4" />
            </div>

            <p className="text-lg">A-1, Ipsum HQ, Lorem</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-[#6DC1A0] lg:p-4 p-2 rounded-full">
              <Mail className="text-white max-lg:size-4" />
            </div>

            <p className="text-lg">Info@Famlink.us</p>
          </div>
        </div>
      </div>
      <div className="w-80 flex justify-center text-center">
        <div>
          <img className="mmy-0 mx-auto" src={logo} alt="logo" />
          <p className=" my-8 Livvic text-[18px] font-[400] leading-[25px]">
            Connecting families with trusted caregivers and building a supportive community.
          </p>
          <div className="flex justify-center gap-8">
            <NavLink
              to={"/"}
              style={({ isActive }) => ({
                color: isActive ? "#49A2FC" : "",
              })}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <p className="text-base cursor-pointer transition-colors duration-300 hover:text-blue-600">
                Home
              </p>
            </NavLink>
            <NavLink
              to={"/services"}
              style={({ isActive }) => ({
                color: isActive ? "#49A2FC" : "",
              })}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <p className="text-base cursor-pointer transition-colors duration-300 hover:text-blue-600">
                Services
              </p>
            </NavLink>
            <p className="text-base cursor-pointer transition-colors duration-300 hover:text-blue-600">
              About Us
            </p>
          </div>
          <div className="flex justify-center gap-8 mt-2">
            <NavLink
              to={"/nannShare"}
              style={({ isActive }) => ({
                color: isActive ? "#49A2FC" : "",
              })}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <p className="text-base cursor-pointer transition-colors duration-300 hover:text-blue-600">
                For Nannies
              </p>
            </NavLink>
            <p className="text-base cursor-pointer transition-colors duration-300 hover:text-blue-600">
              Contact us
            </p>
            <NavLink
              to={"/forFamilies"}
              style={({ isActive }) => ({
                color: isActive ? "#49A2FC" : "",
              })}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <p className="text-base cursor-pointer transition-colors duration-300 hover:text-blue-600">
                For Families
              </p>
            </NavLink>
          </div>
          <div className="flex justify-between px-2 pt-6">
            <a
              href="https://www.facebook.com/profile.php?id=61573842520549"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="object-contain cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-700"
                src={fb}
                alt="Facebook"
              />
            </a>
            <img
              className="object-contain cursor-pointer transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-700 ..."
              src={tw}
              alt="tw"
            />
            <a
              href="https://www.instagram.com/Famlink.us?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="object-contain cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-700"
                src={ins}
                alt="Instagram"
              />
            </a>
            <img
              className="object-contain cursor-pointer transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-700 ..."
              src={yt}
              alt="yt"
            />
          </div>
        </div>
      </div>
      <div>
        <p className="Livvic lg:text-3xl text-2xl font-bold mb-8">
          Subscribe
        </p>
        <p className="Quicksand text-lg leading-[25px] font-light">Subscribe to Our Newsletter</p>
        <Form
          form={form}
          onFinish={async (values) => {
            try {
              const { data } = await api.post("/subscribe/news-letter", {
                email: values.email,
              });
              fireToastMessage({
                message: data?.message || "Subscribed successfully!",
              });

              form.resetFields();
            } catch (error) {
              const msg =
                error?.response?.data?.message ||
                "Something went wrong. Try again!";
              fireToastMessage({ type: "error", message: msg });
            }
            // your logic here
          }}
        >
          <div className="relative mt-4 border-none flex items-center">
            <Form.Item
              name="email"
              rules={[{ required: true, message: "" }]}
              className="w-full"
            >
              <Input
                className="rounded-2xl w-80 py-4 pr-12 border-none !bg-[#38AEE380] focus:!bg-[#38AEE380] hover:!bg-[#38AEE380]"
                type="email"
                placeholder="Your email address"
              />
            </Form.Item>
            <button
              type="submit"
              className="absolute right-4  -mt-1 transform -translate-y-1/2"
            >
              <img src={send} alt="send" />
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
