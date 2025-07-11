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

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState({
    email: false,
    feedback: false,
  });
  const [feedback, setFeedback] = useState("");
  const handleEmailSubmit = async () => {
    if (!email.trim()) return alert("Please enter your email");
    if (!isValidEmail(email)) {
      fireToastMessage({
        message: "Please enter a valid email address",
        type: "error"
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
            <p className="font-normal uppercase Classico home-sec1-head">
              Finding the best match for
            </p>
          </AnimatedWrapper>
          <p className="my-3 font-normal lg:text-3xl text-2xl Elliana-Samantha">
            your {`family's`} unique needs
          </p>

          <NavLink
            to="joinNow"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <button
              style={{ background: "#EFECE6" }}
              className="mt-6 mb-4 px-6 py-1 font-normal text-base transition hover:-translate-y-1 duration-700 delay-150 ... ease-in-out hover:scale-110"
            >
              Get Started Today
            </button>
          </NavLink>

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
        btn={true}
        subHead={
          "Families can link to find anything from nannies and babysitters to tutors, coaches, and  specialized caregivers. We provide a wide range of services to meet your family's unique needs.  Explore our nanny share options and join our vibrant community to connect with other families,  share advice, and find support. Discover how we make childcare easy and personalized for you!"
        }
      />

      <div className="padd-res">
        <Sec2 head={"What can we Offer"} />
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
              className='px-3 font-normal text-4xl uppercase Classico'
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
                className="px-3 font-normal lg:leading-[12px] leading-tight uppercase Classico family-font"
              >
                Join Our Founding Families
              </p>
            </AnimatedWrapper>
            <p className="mx-auto mt-12 mb-14 text-lg home-sec3 line1-20">
              FamyLink is live and helping families find great care, share a
              nanny, and connect with others—all in one place.
            </p>
          </div>
          <div className="bg-white p-8 max-w-4xl mx-auto my-12 ">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Join our newsletter for updates, tips, and early access to new
              features
            </h2>
            <p className="text-gray-600 mb-6">
              Help us shape the future of childcare. We’d love to hear your
              thoughts!
            </p>

            {/* Grid for input sections */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-0 md:justify-around">
              {/* Newsletter Section */}
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-2">
                  → Join Our Newsletter
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-64 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#85D1F1] mb-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  disabled={isLoading.email}
                  className="self-start bg-[#85D1F1] px-5 py-2 rounded-md hover:scale-105 transition"
                  onClick={handleEmailSubmit}
                >
                  {isLoading.email ? "Sending..." : "Join"}
                </button>
              </div>
              <div className="hidden md:block w-px bg-gray-300 mx-4"></div>{" "}
              {/* vertical on md+ */}
              {/* Feedback Section */}
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-2">
                  → Share Your Thoughts
                </label>
                <textarea
                  placeholder="We'd love your feedback..."
                  className="w-96 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#85D1F1] mb-3"
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button
                  disabled={isLoading.feedback}
                  className="self-start bg-[#85D1F1] px-5 py-2 hover:scale-105 rounded-md transition"
                  onClick={handleFeedbackSubmit}
                >
                  {isLoading.feedback ? "Sending..." : "Share"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
