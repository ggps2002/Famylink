import React from "react";
import MetricCard from "../MetricCard";

const metrics = [
  {
    title: "Verified Providers",
    metric: "89+",
    subText: "Across all caregiving categories",
  },
  {
    title: "Families Served",
    metric: "158+",
    subText: "With personalized matches",
  },
  {
    title: "Provider Rating",
    metric: "4.8★",
    subText: "Average caregiver rating across the platform",
  },
];

function Metrics() {
  return (
    <div className="container py-24">
      <h1 className="Livvic-Bold text-5xl mt-12">
        Care Options That Fit Your Life
      </h1>
      <div className="mt-6 flex flex-wrap gap-6 py-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} title={metric.title} metric={metric.metric} subText={metric.subText}/>
        ))}
      </div>
    </div>
  );
}

export default Metrics;
