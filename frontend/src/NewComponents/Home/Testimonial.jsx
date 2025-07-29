import React, { useState } from "react";
import TestimonialCard from "../TestimonialCard";

const testimonials = [
  {
    para: `Finding a math tutor who could work with our learning-different son seemed impossible. Famlink matched us with James, who has the patience and approach our son truly needed.`,
    name: "David L., Brooklyn, NY",
    highlight: "Saved ~$1,800/month through shared tutoring arrangement",
  },
  {
    para: `After our twins were born, we were overwhelmed. Famlink connected us with a night doula who helped us sleep, recover, and feel human again.`,
    name: "Jenna M., Austin, TX",
    highlight: "Avoided ~$2,400/month in agency fees",
  },
  {
    para: `We struggled to find a caregiver who truly understood our daughter's sensory needs. Famlink matched us with Amina, whose autism experience brings calm and joy to each day.`,
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
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-16 sm:my-20 lg:my-28">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="Livvic-Bold text-4xl sm:text-5xl">What Our Families Are Saying</h1>
        <div className="flex gap-4 mt-6 lg:hidden">
          <img 
            src="/arrow-left.svg" 
            alt="arrow-left" 
            className="cursor-pointer"
            onClick={goToPrevious}
          />
          <img 
            src="/arrow-right.svg" 
            alt="arrow-right" 
            className="cursor-pointer"
            onClick={goToNext}
          />
        </div>
      </div>
      
      {/* Mobile/Tablet: Single testimonial */}
      <div className="mt-8 sm:mt-12 lg:mt-16 lg:hidden">
        <TestimonialCard
          para={testimonials[currentIndex].para}
          name={testimonials[currentIndex].name}
          highlight={testimonials[currentIndex].highlight}
        />
      </div>

      {/* Desktop: All three testimonials */}
      <div className="mt-8 sm:mt-12 lg:mt-16 hidden lg:flex justify-between gap-2">
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