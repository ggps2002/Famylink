import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatInterface from "../LoginAsFamily/chatInterface";
// import { getSubscriptionStatusThunk } from "../Redux/cardSlice";

export default function MessageFrameNanny() {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const subscription = useSelector(
  //   (state) => state.cardData.subscriptionStatus
  // );
  // const isSubscribed = subscription?.active;

  // // 🔁 Fetch subscription status on component mount
  // useEffect(() => {
  //   dispatch(getSubscriptionStatusThunk());
  // }, [dispatch]);

  return (
    <div className="Quicksand relative">
      {/* ❌ Blur + Lock Box */}
     
      <div className=" bg-white relative z-0">
          <ChatInterface />
      </div>
    </div>
  );
}
