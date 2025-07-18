import React from "react";
import { CheckCircle } from "lucide-react";

const highlights = [
" Background-checked providers across all services",
 " 18-month average arrangement duration",
 " Save $18,000-$26,000 annually",
 " Built-in community and support network"
]

export default function SavingsHighlightBox() {
  return (
    <div className="mt-8 bg-[#E6F7F9] border border-[#BEE3E9] rounded-2xl p-6 max-w-3xl mx-auto shadow-sm">
      <h3 className="text-xl font-semibold text-[#036672] mb-4 text-center">
        Why Families Love Nanny Sharing
      </h3>
      <ul className="space-y-3">
        {highlights.map((item, index) => (
          <li key={index} className="flex items-start text-gray-700">
            <CheckCircle className="w-5 h-5 text-[#38A3A5] mt-1 mr-2" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
