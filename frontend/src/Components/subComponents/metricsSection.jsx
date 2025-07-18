import React from "react";
import { AnimatedWrapper } from "./animation";
import { Users, Home, Star } from "lucide-react";

const metricsHome = [
  {
    range: "2,847",
    label: "VERIFIED PROVIDERS",
    description: "Across nannies, tutors, coaches, and specialists",
  },
  {
    range: "18 months",
    label: "AVERAGE RELATIONSHIP",
    description: "Compared to hiring solo",
  },
  {
    range: "All Services",
    label: "ONE PLATFORM",
    description: "Nannies to tutors to specialized care",
  },
];

const metricsFamilies = [
  {
    icon: <Users className="w-6 h-6 text-[#38A3A5]" />,
    value: "89",
    label: "Providers across all services",
  },
  {
    icon: <Home className="w-6 h-6 text-[#38A3A5]" />,
    value: "158+",
    label: "Families served successfully",
  },
  {
    icon: <Star className="w-6 h-6 text-[#FFD700]" />,
    value: "4.8★",
    label: "Average provider rating",
  },
];

export default function MetricsSection({ border, head, family }) {
  return (
    <div className={`py-12 ${!family && "bg-[#F9FAFB]"} my-6`}>
      <div className="max-w-6xl mx-auto px-4 text-center">
        {head.length > 0 && (<AnimatedWrapper
          animationConfig={{
            from: { opacity: 0, y: -100 },
            to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
          }}
        >
          <p
            style={{
              borderBottom: !border && "16px solid #DEEBEB",
              display: "inline-block",
            }}
            className="px-3 font-normal uppercase Classico offer-font text-center lg:leading-[12px] leading-tight"
          >
            {head}
          </p>
        </AnimatedWrapper>)}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {family
            ? metricsFamilies.map((metric, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="mb-2">{metric.icon}</div>
                  <h3 className="text-3xl font-bold text-gray-800">
                    {metric.value}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{metric.label}</p>
                </div>
              ))
            : metricsHome.map((metric, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center justify-center"
                >
                  <p className="text-3xl md:text-4xl font-extrabold text-[#38A3A5] mb-2">
                    {metric.range}
                  </p>
                  <p className="uppercase tracking-widest text-sm font-semibold text-gray-600 mb-2">
                    {metric.label}
                  </p>
                  <p className="text-gray-500 text-sm text-center max-w-xs">
                    {metric.description}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
