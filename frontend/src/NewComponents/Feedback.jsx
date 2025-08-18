import React, { useState } from "react";
import { Send, MessageCircle, X, Star, Loader2 } from "lucide-react";
import { api } from "../Config/api";
import { fireToastMessage } from "../toastContainer";

function Feedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // basic pattern
    if (!value) {
      setError("Email is required");
    } else if (!emailRegex.test(value)) {
      setError("Please enter a valid email");
    } else {
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (feedback.trim() && category && email) {
      try {
        setIsSubmitting(true);
        const { data } = await api.post("/feedback", {
          message: feedback,
          email: email,
          category: category,
        });
        fireToastMessage({
          message: data?.message || "Feedback received successfully!",
        });
        setSubmitted(true);
      } catch (error) {
        const msg =
          error?.response?.data?.message || "Something went wrong. Try again!";
        fireToastMessage({ type: "error", message: msg });
      } finally {
        setEmail("");
        setCategory("");
        setFeedback("");
        setIsSubmitting(false);
      }
    }
  };

  const categories = [
    "Bug Report",
    "Feature Request",
    "General Feedback",
    "Complaint",
    "Compliment",
  ];

  const isFormValid = feedback.trim() && category && email && !error; // make sure no email error

  return (
    <div>
      {/* Backdrop Blur */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300 ease-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Floating Feedback Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setSubmitted(false);
        }}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200 ease-out hover:scale-110 active:scale-95 z-50 ${
          isOpen ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      >
        <MessageCircle size={24} className="mx-auto" />
      </button>

      {/* Feedback Form Modal */}
      <div
        className={`fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-soft z-[100] transform transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-75 translate-y-8 pointer-events-none"
        }`}
      >
        {!submitted ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
              <div className="space-y-1">
                <h3 className="text-xl Livvic-SemiBold text-gray-800">
                  Share Your Feedback
                </h3>
                <p className="text-[#777777] text-sm Livvic-Medium max-w-[15rem]">
                  Questions, issues or suggestions ? We'd love to hear from you.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm Livvic-Medium text-primary mb-2">
                  Category
                </label>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between py-2 px-4 border border-[#EEEEEE] w-fit rounded-full cursor-pointer ${
                        category === cat && "bg-primary"
                      }`}
                      onClick={() => setCategory(cat)}
                    >
                      <p className="Livvic-Medium text-[#333333] text-xs">
                        {cat}
                      </p>
                    </div>
                  ))}
                </div>
                {/* <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select> */}
              </div>

              {/* Star Rating */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate your experience
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform duration-150"
                    >
                      <Star
                        size={24}
                        className={`${
                          star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 hover:text-yellow-300"
                        } transition-colors duration-200`}
                      />
                    </button>
                  ))}
                </div>
              </div> */}

              <div className="relative">
                <input
                  id="your-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  className={`peer border ${
                    error ? "border-red-500" : "border-[#EEEEEE]"
                  } rounded-[10px] px-2 pt-7 w-full outline-none focus:outline-none focus:ring-0 placeholder:text-[#999999]`}
                  placeholder="abc@example.com"
                />
                <label
                  htmlFor="your email"
                  className="absolute left-2 top-2 text-sm text-primary Livvic-Medium bg-white px-1 z-10"
                >
                  Your Email
                </label>
              </div>

              {/* Feedback Textarea */}
              <div className="relative w-full">
                <textarea
                  id="description"
                  value={feedback}
                  placeholder="Tell us about your question, issue or feedback..."
                  rows={4}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="peer border border-[#D6DDEB] rounded-[10px] px-2 pt-7 pb-2 w-full placeholder:!text-[#999999] focus:outline-none focus:ring-0 focus:ring-primary"
                  style={{
                    width: "100%",
                    resize: "none",
                  }}
                />
                <label
                  htmlFor="description"
                  className="absolute left-2 top-2 text-sm text-primary Livvic-Medium bg-white px-1 z-10"
                >
                  Your Message
                </label>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you think..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                  required
                />
              </div> */}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="w-full text-primary py-2 px-4 rounded-[20px] Livvic-Medium bg-primary disabled:bg-transparent disabled:text-gray-600 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending..
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Feedback
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Thank you!
            </h3>
            <p className="text-gray-600">
              Your feedback has been submitted successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;
