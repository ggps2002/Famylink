import { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import {
  saveCardThunk,
  createSubscriptionThunk,
  cancelSubscriptionThunk,
  getSubscriptionStatusThunk,
} from "../Redux/cardSlice";
import { fireToastMessage } from "../../toastContainer";
import { CreditCardIcon } from "lucide-react";
import Button from "../../NewComponents/Button";

const BillingMethod = ({ nanny }) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const [billingMethod, setBillingMethod] = useState("card");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("United States of America");
  const [isLoading, setIsLoading] = useState(false);

  const subscription = useSelector(
    (state) => state.cardData.subscriptionStatus
  );
  const isActive = subscription?.active;
  const isCanceling = subscription?.cancelAtPeriodEnd;
  const periodEnd = subscription?.periodEnd;

  useEffect(() => {
    dispatch(getSubscriptionStatusThunk());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setIsLoading(true);
    try {
      const card = elements.getElement(CardNumberElement);
      const expiry = elements.getElement(CardExpiryElement);
      const cvc = elements.getElement(CardCvcElement);

      if (!card || !expiry || !cvc) {
        fireToastMessage({ message: "Card fields missing", type: "error" });
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: {
          address: {
            postal_code: zip,
            country,
          },
        },
      });

      if (error) {
        fireToastMessage({
          message: error.message || "Stripe error",
          type: "error",
        });
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
        }
      }
    } catch (err) {
      console.error(err);
      fireToastMessage({ message: "Payment failed", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    setIsLoading(true);
    try {
      const result = await dispatch(cancelSubscriptionThunk());
      if (cancelSubscriptionThunk.fulfilled.match(result)) {
        fireToastMessage({
          message: "Subscription cancelled",
          type: "success",
        });
      } else {
        fireToastMessage({ message: "Failed to cancel", type: "error" });
      }
    } catch (err) {
      fireToastMessage({ message: "Something went wrong", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Add a billing method</h2>

      {/* CARD / PAYPAL SWITCH */}
      <div className="space-y-4 onboarding-box w-full xl:w-1/2 mt-6 flex flex-col">
        {/* Credit Card Option */}
        <div className="flex items-center justify-between space-x-2">
          <label
            htmlFor="card"
            className="Livvic-SemiBold text-md text-primary flex gap-2"
          >
            <CreditCardIcon /> Credit or Debit card
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              id="card"
              name="billing"
              checked={billingMethod === "card"}
              onChange={() => setBillingMethod("card")}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-full border-4 transition-colors duration-200 ${
                billingMethod === "card"
                  ? "border-[#AEC4FF]"
                  : "border-[#EEEEEE]"
              }`}
            />
          </label>
        </div>

        {billingMethod === "card" && (
          <div className="mt-2 w-full">
            {/* Card Fields */}
            <div className="rounded-[12px] border border-[#EEEEEE]">
              <div className="space-y-2 border-b border-[#EEEEEE] p-2">
                <CardNumberElement
                  options={{
                    placeholder: "Card number",
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#32325d",
                        "::placeholder": {
                          color: "#555555",
                        },
                      },
                    },
                  }}
                  className="p-3"
                />
              </div>

              <div className="flex">
                <div className="w-1/2 border-r border-r-[#EEEEEE] p-3">
                  <CardExpiryElement className="p-2" />
                </div>
                <div className="w-1/2 p-3">
                  <CardCvcElement className="p-2" />
                </div>
              </div>
            </div>
            {/* ZIP + Country */}
            <div className="space-y-4 flex flex-col mt-4">
              <input
                type="text"
                placeholder="Zip code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className=" p-4 border border-[#EEEEEE] rounded-[10px]"
              />
              <div className="relative w-full">
                <div className="pointer-events-none absolute left-3 top-1 text-xs text-gray-500 z-10 bg-white px-1">
                  Country/Region
                </div>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-3 pt-6 border border-[#EEEEEE] rounded-[10px] appearance-none text-primary Livvic-SemiBold"
                >
                  <option value="usa">United States of America</option>
                  <option value="canada">Australia</option>
                  <option value="uk">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* PayPal Option */}
        <div className="flex items-center justify-between space-x-2">
          <label
            htmlFor="paypal"
            className="Livvic-SemiBold text-md text-primary flex items-center gap-2"
          >
            <img src="/paypal-logo.svg" alt="logo" className="w-6 h-6" /> PayPal
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              id="paypal"
              name="billing"
              checked={billingMethod === "paypal"}
              onChange={() => setBillingMethod("paypal")}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-full border-4 transition-colors duration-200 ${
                billingMethod === "paypal"
                  ? "border-[#AEC4FF]"
                  : "border-[#EEEEEE]"
              }`}
            />
          </label>
        </div>

        {/* Billing Status */}
        {isActive && (
          <p className="mt-4 text-sm text-green-600 font-medium">
            Subscription active
            {isCanceling && periodEnd && (
              <>
                {" "}
                — set to cancel on{" "}
                <strong>
                  {new Date(periodEnd * 1000).toLocaleDateString()}
                </strong>
              </>
            )}
          </p>
        )}
        <div className="flex gap-2 justify-end">
          {/* Cancel Button */}
          {isActive && !isCanceling && (
            <Button
              action={() => cancelSubscription()}
              disabled={isLoading}
              btnText={isLoading ? "Cancelling..." : "Cancel Subscription"}
              className="text-[#555555] border border-[#EEEEEE]"
            />
          )}
          {/* Submit Button */}
          {!isActive && !isCanceling && (
            <Button
              action={billingMethod === "card" ? handleSubmit : undefined}
              disabled={isLoading}
              btnText={
                isLoading
                  ? "Processing..."
                  : billingMethod === "paypal"
                  ? "Continue with PayPal"
                  : "Confirm Payment"
              }
              className="bg-[#AEC4FF]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingMethod;
