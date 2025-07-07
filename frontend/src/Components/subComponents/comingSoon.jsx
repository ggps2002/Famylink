import { useState } from "react";
import img from "../../assets/images/coming-soon.png";
import { fireToastMessage } from "../../toastContainer";
import { api } from "../../Config/api";
import { Button } from "antd";

export default function ComingSoon({ bg }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  // Function to validate email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = async () => {
    if (!email) {
      setError("Email is required!");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address!");
      return;
    }

    setError("");

    try {
      setLoading(true)
      const { data } = await api.post("/subscribe/news-letter", {
        email: email,
      });
      fireToastMessage({
        message: data?.message || "Subscribed successfully!",
      });
      setLoading(false)
      setEmail('')
    } catch (error) {
      setLoading(false)
      const msg =
        error?.response?.data?.message || "Something went wrong. Try again!";
      fireToastMessage({ type: 'error', message: msg });
    }
  };

  return (
    <div className="padding-navbar1 Quicksand">
      <div className={` ${!bg && 'bg-white shadow-custom-shadow'} gap-6 flex flex-col justify-center items-center h-screen rounded-2xl p-6 `}>
        <img src={img} alt="coming-soon" className="max-lg:size-48" />
        <p className="text-4xl font-bold Classico">Coming Soon</p>
        <p className="lg:w-[570px] lg:text-lg text-[#4E545F] text-center">
          Are you ready to get something new from us? Subscribe to the
          newsletter to get the latest updates!
        </p>
        <div className="flex justify-center items-start h-16 gap-2 lg:text-lg mt-4 px-4 max-lg:px-0 w-full">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`border-none bg-white shadow-custom-shadow lg:w-96 w-full lg:h-14 h-10 text-[#4E545F] placeholder:text-[#4E545F] lg:rounded-2xl rounded-lg px-4`}
            />
            {error && <p className="text-red-500 text-sm mt-1 ml-2">{error}</p>}
          </div>

          <Button
            loading={loading}
            className="submit bg-[#38AEE3] hover:bg-[#38AEE3] text-white lg:h-14 h-10 px-4 lg:rounded-2xl rounded-lg lg:w-36"
            onClick={handleSubscribe}
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}
