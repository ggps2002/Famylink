import React from "react";

const inventoryStats = [
  {
    number: "47",
    label: "nanny share opportunities",
    location: "in Brooklyn",
  },
  {
    number: "156",
    label: "nannies open to sharing arrangements",
    location: "",
  },
  {
    number: "23",
    label: "families looking to share",
    location: "in Manhattan",
  },
];

export default function InventoryNumbers() {
  return (
    <section className="rounded-xl">
      <h2 className="font-2xl uppercase font-bold Classico mb-8 text-center">
        Available Now
      </h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-5xl mx-auto">
        {inventoryStats.map((item, idx) => (
          <div
            key={idx}
            className="text-center bg-white px-6 py-5 rounded-lg w-full md:w-1/3"
          >
            <p className="text-4xl font-bold text-[#3B82F6]">{item.number}</p>
            <p className="text-gray-700 mt-2 font-medium">{item.label}</p>
            {item.location && (
              <p className="text-sm text-gray-500 mt-1">{item.location}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
