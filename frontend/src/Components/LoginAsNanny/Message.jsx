import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatInterface from "../LoginAsFamily/chatInterface";
import { getSubscriptionStatusThunk } from "../Redux/cardSlice";

export default function MessageFrameNanny() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subscription = useSelector(
    (state) => state.cardData.subscriptionStatus
  );
  const isSubscribed = subscription?.active;

  // 🔁 Fetch subscription status on component mount
  useEffect(() => {
    dispatch(getSubscriptionStatusThunk());
  }, [dispatch]);

  return (
    <div className="padding-navbar1 Quicksand relative py-6">
      {/* ❌ Blur + Lock Box */}
      {!isSubscribed && (
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="bg-white shadow-xl rounded-2xl p-8 w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-semibold text-[#050A30] mb-3">
              Subscribe to Unlock
            </h2>
            <p className="text-gray-600 mb-6">
              Unlock messaging to contact this caregiver
            </p>
            <button
              onClick={() => navigate("/nanny/pricing")}
              className="bg-[#38AEE3] hover:opacity-90 text-white font-medium py-2 px-6 rounded-full transition-all"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}
      <div className="shadow border-[1px] border-[#D6DDEB] bg-white rounded-xl relative z-0">
        <p className="lg:text-3xl text-2xl font-bold edit-padding">Messages</p>
        <div className="padding-sub pb-10">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
