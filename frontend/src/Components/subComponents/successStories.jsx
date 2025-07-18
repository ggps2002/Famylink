import React from "react";

const successStories = [
  "Rodriguez & Kim families: Perfect schedule and values match, 18 months strong",
  "Thompson & Lee families: Compatible parenting styles, 2 years of successful sharing",
  "Sarah M. just started her nanny share position with two families",
];

export default function SuccessStories() {
  return (
    <section className=" py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-2xl uppercase font-bold Classico mb-8">
          Recent Success Stories
        </h2>
        <ul className="space-y-5 text-gray-700 text-base md:text-lg">
          {successStories.map((story, index) => (
            <li
              key={index}
              className="bg-white shadow-md py-4 px-6 rounded-lg border-l-4 border-[#38BDF8] text-left"
            >
              {story}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
