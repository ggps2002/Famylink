import React from "react";
import TestimonialCard from "../TestimonialCard";

const testimonials = [
  {
    para: `Finding a math tutor who could work with our learning-different son seemed impossible. FamyLink matched us with James, who has the patience and approach our son truly needed.`,
    name: "David L., Brooklyn, NY",
    highlight: "Saved ~$1,800/month through shared tutoring arrangement",
  },
  {
    para: `After our twins were born, we were overwhelmed. FamyLink connected us with a night doula who helped us sleep, recover, and feel human again.`,
    name: "Jenna M., Austin, TX",
    highlight: "Avoided ~$2,400/month in agency fees",
  },
  {
    para: `We struggled to find a caregiver who truly understood our daughter’s sensory needs. FamyLink matched us with Amina, whose autism experience brings calm and joy to each day.`,
    name: "Priya S., San Mateo, CA",
    highlight: "Saved 15+ hours/week in stressful trial-and-error searches",
  },
  // {
  //   img: img4,
  //   para: "I loved being able to post exactly what we needed. We got multiple great applicants within days.",
  //   name: "Nina R.",
  //   relation: "Single Mom",
  // },
];

function Testimonial() {
  return (
    <div className="container my-28">
      <div className="flex justify-between">
        <h1 className="Livvic-Bold text-5xl">What Our Families Are Saying</h1>
        <div className="flex gap-4">
          <img src="/arrow-left.svg" alt="arrow-left" />
          <img src="/arrow-right.svg" alt="arrow-right" />
        </div>
      </div>
      <div className="mt-16 flex justify-between">
        {testimonials.map((t, i) => (
          <TestimonialCard
            key={i}
            para={t.para}
            name={t.name}
            highlight={t.highlight}
          />
        ))}
      </div>
    </div>
  );
}

export default Testimonial;
