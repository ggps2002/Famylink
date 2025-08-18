import React, { useState } from "react";
import { Input, Button, Spin } from "antd";
import { fireToastMessage } from "../../toastContainer";
import { AnimatedWrapper } from "./animation";

export default function SavingsCalculator({head}) {
  const [zipCode, setZipCode] = useState("");
  const [currentCost, setCurrentCost] = useState("");
  const [savings, setSavings] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleZipValidation = async (zip) => {
    if (!zip) return false;

    setLoading(true);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);

      if (!res.ok) throw new Error("Invalid ZIP");

      const data = await res.json();
      const finalZip = data["post code"];
      if (finalZip) {
        setZipCode(finalZip);
        return true;
      } else {
        throw new Error("Invalid structure");
      }
    } catch (err) {
      setZipCode("");
      fireToastMessage({
        type: "error",
        message: "Invalid ZIP code. Please enter a valid U.S. ZIP.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    const cost = parseFloat(currentCost);
    const isValidZip = await handleZipValidation(zipCode.trim());

    if (!isValidZip || isNaN(cost) || cost <= 0) {
      fireToastMessage({
        type: "error",
        message: "Please enter a valid ZIP code and monthly childcare cost.",
      });
      setSavings(null);
      return;
    }

    // Estimate savings
    const minSave = cost * 0.4;
    const maxSave = cost * 0.5;

    setSavings({
      zip: zipCode,
      range: [minSave.toFixed(0), maxSave.toFixed(0)],
    });
  };

  return (
    <section className="bg-[#F9FAFB] py-12 px-4 mt-12">
      <div className="max-w-2xl mx-auto text-center">
        <AnimatedWrapper
          animationConfig={{
            from: { opacity: 0, y: -50 },
            to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
          }}
        >
          <h2 className="font-normal text-center Livvic uppercase px-3 offer-font">
            {head}
          </h2>
        </AnimatedWrapper>
        <p className="mb-8">
          See how much you could save each month by sharing a nanny.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Spin spinning={loading} size="small">
            <Input
              placeholder="Enter your ZIP code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              maxLength={10}
            />
          </Spin>
          <Input
            placeholder="Your monthly childcare cost"
            value={currentCost}
            onChange={(e) => setCurrentCost(e.target.value)}
            type="number"
            prefix="$"
          />
        </div>

        <button onClick={handleCalculate} className="mt-auto bg-[#85D1F1] text-base px-4 py-1 rounded-full hover:scale-105 transition">
          Calculate Savings
        </button>

        {savings && (
          <div className="mt-6 bg-white p-5 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2 text-green-600">
              Potential Monthly Savings:
            </h3>
            <p className="text-lg">
              Between <strong>${savings.range[0]}</strong> and{" "}
              <strong>${savings.range[1]}</strong> per month.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Based on ZIP code: {savings.zip}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
