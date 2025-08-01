import React from "react";
import MetricCard from "../MetricCard";

const metrics = [
  {
    title: "",
    metric: "47",
    subText: "Nanny share opportunities in Brooklyn",
  },
  {
    title: "",
    metric: "156",
    subText: "Nannies open to shared arrangements",
  },
  {
    title: "",
    metric: "23",
    subText: "Families currently looking to share in Manhattan",
  },
];

function Metrics() {
  return (
    <div className="container py-12 sm:py-24 px-4 sm:px-0">
      <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6 py-6">
        {metrics.map((metric) => (
          <MetricCard 
            key={metric.title} 
            title={metric.title} 
            metric={metric.metric} 
            subText={metric.subText}
          />
        ))}
      </div>
    </div>
  );
}

export default Metrics;