import ChatInterface from "./chatInterface";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getSubscriptionStatusThunk } from "../Redux/cardSlice";

export default function MessageFrame() {
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
    <div className="relative padding-navbar1 Quicksand py-8">
      {/* Blurred overlay when unsubscribed */}
      {!isSubscribed && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-[4px] bg-white/50 z-20 flex items-center justify-center rounded-xl">
             <div className="bg-white shadow-xl rounded-2xl p-8 w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-semibold text-[#050A30] mb-3">
              Subscribe to Unlock
            </h2>
            <p className="text-gray-600 mb-6">
              Unlock messaging to contact this caregiver
            </p>
            <button
              onClick={() => navigate("/family/pricing")}
              className="bg-[#38AEE3] hover:opacity-90 text-white font-medium py-2 px-6 rounded-full transition-all"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      <div className="shadow border-[1px] border-[#D6DDEB] bg-white rounded-xl my-5 relative z-10">
        <p className="lg:text-3xl text-2xl font-bold edit-padding">Messages</p>
        <div className="padding-sub pb-10">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
