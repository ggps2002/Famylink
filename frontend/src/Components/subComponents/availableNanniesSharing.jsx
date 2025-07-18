import React from "react";

const nannies = [
  {
    name: "Maria S.",
    rating: 5,
    experience: "Experienced in nanny sharing",
    rate: "$22–25/hour split between families",
    quote: "I love nanny sharing because children become best friends...",
    action: "Contact Maria – Sign Up Required",
  },
  {
    name: "Jennifer L.",
    rating: 5,
    experience: "8 years experience",
    rate: "$20–24/hour split between families",
    quote: "Specializing in shared care for toddlers and preschoolers...",
    action: "Contact Jennifer – Sign Up Required",
  },
];

const AvailableNanniesSharing = () => {
  return (
    <section className="py-12 px-4">
      <h2 className="font-2xl uppercase font-bold Classico mb-8 text-center">
        Nannies Open to Sharing Arrangements
      </h2>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {nannies.map((nanny, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {nanny.name}{" "}
              <span className="text-yellow-500 ml-1">
                {"★".repeat(nanny.rating)}
              </span>
            </h3>
            <p className="text-sm text-gray-600 italic">{nanny.experience}</p>
            <p className="text-base font-medium text-green-600 mt-2">
              {nanny.rate}
            </p>
            <p className="text-gray-700 mt-4">"{nanny.quote}"</p>
            <button className="mt-6 bg-[#85D1F1] text-base px-4 py-1 rounded-full hover:scale-105 transition">
              {nanny.action}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AvailableNanniesSharing;
