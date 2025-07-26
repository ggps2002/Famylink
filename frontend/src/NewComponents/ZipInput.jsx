import React, { useState } from "react";
import { Spin, Input } from "antd";
import { fireToastMessage } from "../toastContainer";

function ZipInput({ border = false }) {
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");

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
  return (
    <div>
      <Spin
        spinning={loading}
        size="small"
        className="absolute z-10 left-3 top-1/2 -translate-y-1/2"
      >
        <Input
          name="zipCode"
          placeholder="Enter zip code to find caregivers"
          onChange={(e) => {
            const zip = e.target.value;
            setZipCode(zip);
          }}
          onBlur={(e) => handleZipValidation(e.target.value.trim())}
          value={zipCode}
          className={`w-full p-4 pr-12 ${
            border ? "border border-[#E2E6F1]" : "border-none"
          } rounded-full input-width`}
          maxLength={10}
        />
      </Spin>
    </div>
  );
}

export default ZipInput;
