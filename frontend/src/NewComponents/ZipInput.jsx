import React, { useState } from "react";
import { Spin, Input } from "antd";

function ZipInput({border=false}) {
  const [loading, setLoading] = useState(false);
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
          //   value={zipCode}
          onChange={(e) => {
            // const zip = e.target.value;
            // setZipCode(zip);
          }}
          //   onBlur={(e) => handleZipValidation(e.target.value.trim())}
          className={`w-full p-4 pr-12 ${border ? "border border-[#E2E6F1]" : "border-none"} rounded-full input-width`}
          maxLength={10}
        />
      </Spin>
    </div>
  );
}

export default ZipInput;
