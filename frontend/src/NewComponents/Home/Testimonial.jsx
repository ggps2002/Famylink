import React, { useState } from "react";
import TestimonialCard from "../TestimonialCard";

const caregiverTestimonials = [
  {
    para: `I was struggling to find steady work that respected my skills and schedule. Famlink connected me with a wonderful family who truly values my background and flexibility.`,
    name: "Camila R., Bronx, NY",
    highlight: "Secured 30 hrs/week within 5 days of joining",
  },
  {
    para: `I’ve worked as a nanny for 10+ years, but it was always hard to find good families. Famlink helped me present my profile professionally and matched me with families who fit my style.`,
    name: "Josephine A., Chicago, IL",
    highlight: "Avoided $500/month in agency cuts",
  },
  {
    para: `As a part-time student and caregiver, I needed a schedule that worked for me. Famlink helped me find after-school hours with two families right in my neighborhood.`,
    name: "Rhea T., Seattle, WA",
    highlight: "Now earning ~$1,100/month in flexible care work",
  },
];

const nannyShareTestimonials = [
  {
    para: `We wanted high-quality care for our daughter but couldn’t afford full-time nanny rates. Famlink introduced us to another family nearby and we now share a wonderful nanny we both trust.`,
    name: "Marcus & Lila H., Denver, CO",
    highlight: "Cut childcare costs by ~$1,200/month through sharing",
  },
  {
    para: `I was hesitant about nanny sharing, but Famlink made it easy. We met a like-minded family and now our toddlers are thriving together under one amazing caregiver.`,
    name: "Ayesha K., Berkeley, CA",
    highlight: "Built lasting bonds & saved ~40% on care expenses",
  },
  {
    para: `Thanks to Famlink, we found a compatible family within blocks of us. Our nanny now watches both our kids, and they’ve become best friends. It’s a win-win.`,
    name: "Emily N., Charlotte, NC",
    highlight: "Reduced nanny costs by ~$1,000/month, doubled social time",
  },
];


const familyTestimonials = [
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

function Testimonial({ type = "Family" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonialsMap = {
    Family: familyTestimonials,
    Caregiver: caregiverTestimonials,
    NannyShare: nannyShareTestimonials,
  };

  const testimonials = testimonialsMap[type] || [];

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
        <h1 className="Livvic-Bold text-4xl sm:text-5xl">
          {type === "Caregiver"
            ? "What Our Caregivers Are Saying"
            : type === "NannyShare"
            ? "What Nanny Share Families Are Saying"
            : "What Our Families Are Saying"}
        </h1>
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

      {/* Desktop: All testimonials */}
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