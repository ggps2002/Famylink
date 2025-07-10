import { useState, useEffect } from "react";
import { AnimatedWrapper } from "../subComponents/animation";
import { Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import {
  saveCardThunk,
  createSubscriptionThunk,
  cancelSubscriptionThunk,
  getSubscriptionStatusThunk,
} from "../Redux/cardSlice";
import { fireToastMessage } from "../../toastContainer";

const Card = ({ head, price, data, buy, nanny, showBuyButton, cancelAt }) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsLoading(true);
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        fireToastMessage({ message: "Stripe error", type: "error" });
        return;
      }

      const saveResult = await dispatch(saveCardThunk(paymentMethod));
      if (saveCardThunk.fulfilled.match(saveResult)) {
        const createResult = await dispatch(
          createSubscriptionThunk({
            paymentMethodId: paymentMethod.id,
            priceId: nanny
              ? import.meta.env.VITE_STRIPE_NANNY_PREMIUM_PRICE_ID
              : import.meta.env.VITE_STRIPE_FAMILY_PREMIUM_PRICE_ID,
          })
        );

        if (createSubscriptionThunk.fulfilled.match(createResult)) {
          fireToastMessage({
            message: "Subscription active!",
            type: "success",
          });
          setShowPayment(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:w-96 w-full min-h-[543px] bg-white rounded-3xl p-6 flex flex-col shadow-lg">
      {/* Header */}
      <div className="mb-6 Classico">
        <p className="text-2xl text-[#050A30]">{head}</p>
        <p className="text-5xl mt-2">
          ${price}
          <sub className="text-2xl font-normal text-black">/mo</sub>
        </p>
      </div>

      {/* Features List */}
      <div className="flex-1 flex flex-col gap-8 mt-4">
        {data?.map((v, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="p-1.5 bg-[#38AEE3] rounded-full">
              <Check className="text-white size-3" />
            </div>
            <p className="text-lg text-[#050A30]">{v}</p>
          </div>
        ))}
      </div>

      {/* Stripe Card Element */}
      {showBuyButton && showPayment && (
        <div className="mt-6">
          <CardElement className="p-3 border border-gray-300 rounded-lg mb-4" />
          <button
            disabled={isLoading}
            className="bg-[#38AEE3] text-white py-2 px-4 rounded-full w-full"
            onClick={handleBuyNow}
          >
            {isLoading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      )}

      {/* CTA Button Logic */}
      {showBuyButton && !showPayment && (
        <button
          onClick={() => setShowPayment(true)}
          className="mt-8 bg-[#38AEE3] hover:opacity-80 text-white font-medium w-52 mx-auto h-10 rounded-full transition-all duration-300 ease-in-out"
        >
          Buy
        </button>
      )}

      {!showBuyButton && head !== "Free" && (
        <>
          {cancelAt ? (
            <p className="text-center text-red-600 font-medium mt-4">
              Set to cancel on {cancelAt}
            </p>
          ) : (
            <button
              onClick={async () => {
                setIsLoading(true);
                try {
                  const result = await dispatch(cancelSubscriptionThunk());
                  if (cancelSubscriptionThunk.fulfilled.match(result)) {
                    fireToastMessage({
                      message: "Subscription cancelled",
                      type: "success",
                    });
                  } else {
                    fireToastMessage({
                      message: result.payload?.message || "Failed to cancel",
                      type: "error",
                    });
                  }
                } catch (err) {
                  fireToastMessage({
                    message: "Something went wrong",
                    type: "error",
                  });
                  console.error(err);
                } finally {
                  setIsLoading(false);
                }
              }}
              className="mt-8 bg-red-500 hover:bg-red-600 text-white font-medium w-52 mx-auto h-10 rounded-full transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Cancelling..." : "Cancel Subscription"}
            </button>
          )}
        </>
      )}

      {!showBuyButton && head === "Free" && (
        <button
          disabled
          className="mt-8 bg-[#38AEE380] text-white font-medium w-52 mx-auto h-10 rounded-full cursor-not-allowed"
        >
          Already Using
        </button>
      )}
    </div>
  );
};

export default function Pricing({ nanny }) {
  const dispatch = useDispatch();
  const subscription = useSelector(
    (state) => state.cardData.subscriptionStatus
  );
  const isActive = subscription?.active;
  const isCanceling = subscription?.cancelAtPeriodEnd;
  const periodEnd = subscription?.periodEnd;

  useEffect(() => {
    dispatch(getSubscriptionStatusThunk());
  }, [dispatch]);

  const cardData = [
    {
      head: "Free",
      price: 0,
      data: nanny
        ? [
            "Create a profile",
            "Search for jobs",
            "Apply for jobs",
            "Receive and reply to messages",
            "Join the Famylink Community",
          ]
        : [
            "Connect share advice and build relationships in the Famylink Community",
            "Browse a limited list of caregiver profiles",
            "Browse a limited list of families for nanny share",
          ],
      buy: true,
      showBuyButton: false,
    },
    {
      head: nanny ? "Premium" : "Family Plus",
      price: nanny ? 5.99 : 9.99,
      data: nanny
        ? [
            "Unlimited job application",
            "Unlock messaging with families",
            "Boost profile visiblility in searches",
          ]
        : [
            "Post a job",
            "Post a nanny share",
            "Browse Caregiver profile",
            "Message Caregiver",
          ],
      buy: isActive,
      showBuyButton: !isActive,
      cancelAt: isCanceling
        ? new Date(periodEnd * 1000).toLocaleDateString()
        : null,
    },
  ];

  return (
    <div
      className={`lg:py-12 py-6 px-1 bg-gradient-to-b ${
        nanny
          ? "from-[#FFEE8C] to-[#fdf8ea]"
          : "from-[#9EDCE1] via-[#DAF4EF] to-[#EFECE6]"
      }`}
    >
      <div className="padd-res">
        <AnimatedWrapper
          animationConfig={{
            from: { opacity: 0, y: -50 },
            to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
          }}
        >
          <p className="Classico !font-normal lg:text-6xl text-3xl">
            Subscription Plans
          </p>
        </AnimatedWrapper>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex items-start justify-center rounded-full lg:my-16 my-8 bg-white mx-auto shadow-md"></div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mx-2">
        {cardData.map((v, i) => (
          <AnimatedWrapper
            key={i}
            animationConfig={{
              from: { opacity: 0, y: -50 },
              to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
            }}
          >
            <Card
              key={i}
              head={v.head}
              price={v.price}
              data={v.data}
              buy={v.buy}
              nanny={nanny}
              showBuyButton={v.showBuyButton}
              cancelAt={v.cancelAt}
            />
          </AnimatedWrapper>
        ))}
      </div>
    </div>
  );
}
