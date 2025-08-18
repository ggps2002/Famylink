import React, { useState } from "react";
import img2 from "../../assets/images/img2.png";
import Sec2 from "../subComponents/sec2";
import s1 from "../../assets/images/s1.png";
import s2 from "../../assets/images/s2.png";
import s3 from "../../assets/images/s3.png";
import ServeCard from "../subComponents/serveCard";
import logo from "../../assets/images/logo2.png";
import f1 from "../../assets/images/f1.png";
import f2 from "../../assets/images/f2.png";
import f3 from "../../assets/images/f3.png";
import f4 from "../../assets/images/f4.png";
import f5 from "../../assets/images/f5.png";
import f6 from "../../assets/images/f6.png";
import Sec3 from "../subComponents/sec3";
import FamilyCard from "../subComponents/familyLinkCard";
import { TestimonialSlider } from "../subComponents/carousel";
import Sec4 from "../subComponents/sec4";
import { NavLink } from "react-router-dom";
import { AnimatedWrapper } from "../subComponents/animation";
import { fireToastMessage } from "../../toastContainer";
import { api } from "../../Config/api";
import { Spin, Input } from "antd";
import { Search } from "lucide-react";
import NannySharePreview from "../subComponents/nannySharePreview";
import MetricsSection from "../subComponents/metricsSection";

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState({
    email: false,
    feedback: false,
  });
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const handleEmailSubmit = async () => {
    if (!email.trim()) return alert("Please enter your email");
    if (!isValidEmail(email)) {
      fireToastMessage({
        message: "Please enter a valid email address",
        type: "error",
      });
      return;
    }
    setIsLoading((prev) => ({ ...prev, email: true }));
    try {
      const { data } = await api.post("/subscribe/news-letter", {
        email: email,
      });
      fireToastMessage({
        message: data?.message || "Subscribed successfully!",
      });
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Something went wrong. Try again!";
      fireToastMessage({ type: "error", message: msg });
    } finally {
      setEmail("");
      setIsLoading((prev) => ({ ...prev, email: false }));
    }
  };

  const handleZipValidation = async (zip) => {
    if (!zip) return;

    setLoading(true);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) throw new Error("Invalid ZIP");

      const data = await res.json();
      const finalZip = data["post code"];
      if (finalZip) {
        setZipCode(finalZip);
        // form.setFieldsValue({
        //   zipCode: finalZip,
        // });
      } else {
        throw new Error("Invalid structure");
      }
    } catch (err) {
      setZipCode("");
      // form.setFieldsValue({ zipCode: "" });
      fireToastMessage({
        type: "error",
        message: "Invalid ZIP code. Please enter a valid U.S. ZIP.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return alert("Please enter your thoughts");
    setIsLoading((prev) => ({ ...prev, feedback: true }));
    try {
      const { data } = await api.post("/feedback", {
        text: feedback,
      });
      fireToastMessage({
        message: data?.message || "Feedback received successfully!",
      });
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Something went wrong. Try again!";
      fireToastMessage({ type: "error", message: msg });
    } finally {
      setEmail("");
      setIsLoading((prev) => ({ ...prev, feedback: false }));
    }
    setFeedback("");
  };
  return (
    <>
      <div className="relative flex justify-center items-center text-center home-sec1">
        <div>
          <AnimatedWrapper
            animationConfig={{
              from: { opacity: 0, y: -50 },
              to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
            }}
          >
            <p className="font-normal uppercase Livvic home-sec1-head">
              Find Your Perfect Childcare Match
            </p>
            <p className="font-semibold Livvic home-sec1-subHead">
              Smart matching for nannies, tutors, coaches, and all your family's
              needs
            </p>
          </AnimatedWrapper>
          <p className="my-3 font-normal lg:text-3xl text-2xl Elliana-Samantha">
            Smart matching <span className="font-sans">.</span> Trusted
            providers <span className="font-sans">.</span> Successful
            relationships.
          </p>

          <div className="relative w-full mt-12">
            {/* Optional: Wrap Spin over just the input for precise control */}
            <Spin
              spinning={loading}
              size="small"
              className="absolute z-10 left-3 top-1/2 -translate-y-1/2"
            />

            <Input
              name="zipCode"
              placeholder="Enter your zip code to see families near you"
              value={zipCode}
              onChange={(e) => {
                const zip = e.target.value;
                setZipCode(zip);
              }}
              onBlur={(e) => handleZipValidation(e.target.value.trim())}
              className="w-full p-4 pr-12 border-none rounded-3xl input-width"
              maxLength={10}
            />

            <Search className="absolute right-4 lg:right-[32%] top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="flex md:gap-6 flex-col md:flex-row md:justify-center">
            <NavLink
              to="/joinNow"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <button
                style={{ background: "#EFECE6" }}
                className="mt-6 px-6 py-1 font-normal text-base transition hover:-translate-y-1 duration-700 delay-150 ... ease-in-out hover:scale-110"
              >
                Find Your Perfect Match
              </button>
            </NavLink>
            <NavLink
              to="/joinNow"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <button
                // style={{ background: "#EFECE6" }}
                className="mt-6 mb-4 px-6 py-1 font-normal border border-black text-base"
              >
                Browse Caregivers
              </button>
            </NavLink>
          </div>

          <p className="hover:opacity-70 font-normal text-base">
            <NavLink
              to="login"
              className="hover:text-blue-600 transition-colors duration-300 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Already have an account? Log in
            </NavLink>
          </p>
          <div
            onClick={() =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
            className="hidden absolute bottom-6 left-0 right-0 lg:flex justify-center cursor-pointer"
          >
            <img
              src={img2}
              alt="scroll-down"
              className="w-12 h-12 animate-bounce"
            />
          </div>
        </div>
      </div>

      <Sec4
        btn={false}
        subHead={`Finding the right childcare shouldn't be guesswork. Famlink uses smart 
compatibility matching to connect your family with the perfect providers - whether you 
need a nanny, tutor, coach, or specialized caregiver. Our proven matching system creates 
successful long-term relationships while offering cost-sharing opportunities when 
families want them.`}
      />

      <div className="padd-res">
        <NannySharePreview head={"Childcare Solutions Matched to Your Family"} />
      </div>

      <div className="padd-res">
        <Sec2 head={"Find the Right Caregiver for Your Family"} />
      </div>

      {/* <div className='flex justify-center items-center mt-16 text-center'>
        <div>
          <AnimatedWrapper
            animationConfig={{
              from: { opacity: 0, y: -50 },
              to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
            }}
          >
            <p
              style={{
                lineHeight: '12px',
                borderBottom: '16px solid #DEEBEB',
                display: 'inline-block' // Ensures the border matches the text width
              }}
              className='px-3 font-normal text-4xl uppercase Livvic'
            >
              Who We Serve
            </p>
          </AnimatedWrapper>
          <div className='flex flex-wrap justify-center items-center gap-4 my-10'>
            <ServeCard img={s1} head={'Families'} link={'/forFamilies'} />
            <ServeCard img={s2} head={'Job Seekers'} link={'/jobSeekers'} />
            <ServeCard img={s3} head={'Companies'} link={'/yourBusiness'} />
          </div>
        </div>
      </div> */}

      <AnimatedWrapper
        animationConfig={{
          from: { opacity: 0, y: -100 },
          to: { opacity: 1, y: 0, duration: 2.5, ease: "power3.out" },
        }}
      >
        <Sec3 first={true} sec={true} />
      </AnimatedWrapper>

      <div className="flex flex-wrap justify-center items-center mt-16 text-center">
        <div>
          <img
            className="mx-auto my-0 w-80 object-contain"
            src={logo}
            alt="logo"
          />

          <div className="flex flex-wrap justify-center gap-5 my-16">
            <FamilyCard
              img={f1}
              head={"Learn"}
              para={"Discover the benefits of nanny sharing."}
            />
            <FamilyCard
              img={f2}
              head={"Find"}
              para={"Locate nannies, babysitters, tutors, and more."}
            />
            <FamilyCard
              img={f3}
              head={"Connect"}
              para={"Join our vibrant community of families and caregivers."}
            />
            <FamilyCard
              img={f4}
              head={"Hire"}
              para={"Access specialized caregivers for unique needs."}
            />
            <FamilyCard
              img={f5}
              head={"Support"}
              para={"Get advice and resources for childcare."}
            />
            <FamilyCard
              img={f6}
              head={"Manage"}
              para={"Utilize job contract templates for your caregivers."}
              bord={true}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <NavLink
              to="/joinNow"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <button
                style={{ border: "1px solid #DEEBEB" }}
                className="px-10 py-1 font-normal text-base transition hover:-translate-y-1 duration-700 delay-150 ... ease-in-out hover:scale-110"
              >
                Find Care
              </button>
            </NavLink>
            <NavLink
              to="/joinNow"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <button
                style={{ background: "#85D1F1" }}
                className="px-10 py-1 font-normal text-base transition hover:-translate-y-1 duration-700 delay-150 ... ease-in-out hover:scale-110"
              >
                Find a Job
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      <MetricsSection head={"Why Smart Matching Works Across All Services"} family={false} />

      <div className="flex flex-col w-full max-lg:px-2 flex-wrap justify-center items-center mt-16 text-center">
        <div>
          <div>
            <AnimatedWrapper
              animationConfig={{
                from: { opacity: 0, y: -50 },
                to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
              }}
            >
              <p
                style={{
                  borderBottom: "16px solid #DEEBEB",
                  display: "inline-block", // Ensures the border matches the text width
                }}
                className="px-3 font-normal lg:leading-[12px] leading-tight uppercase Livvic family-font"
              >
                What our families are saying
              </p>
            </AnimatedWrapper>
            <p className="mx-auto mt-12 mb-14 text-lg home-sec3 line1-20">
              Famlink is live and helping families find great care, share a
              nanny, and connect with others—all in one place.
            </p>
          </div>
          <div className="bg-white p-8 max-w-4xl mx-auto my-12 ">
            <TestimonialSlider />
          </div>
        </div>
      </div>
    </>
  );
}
