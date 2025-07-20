import React from "react";
import ServicesCard from "../ServicesCard";

const services = [
  {
    icon: "/icons/Services/Nanny4.svg",
    title: "Nanny",
    description:
      "Experienced full-time, part-time, or live-in care tailored to your schedule.",
  },
  {
    icon: "/icons/Services/Babysitter.svg",
    title: "Babysitter",
    description: "Reliable care for evenings, weekends, or last-minute help.",
  },
  {
    icon: "/icons/Services/PrivateEducator.svg",
    title: "Private Educator",
    description:
      "One-on-one academic support at home from qualified tutors and educators.",
  },
  {
    icon: "/icons/Services/SpecializedCaregiver.svg",
    title: "Specialized Caregiver",
    description:
      "Doulas, night nurses, or caregivers trained for specific family needs.",
  },
  {
    icon: "/icons/Services/SportCoach.svg",
    title: "Sports Coaches",
    description:
      "Skill-building and athletic development for all ages and experience levels.",
  },
  {
    icon: "/icons/Services/MusicInstructor.svg",
    title: "Music Instructors",
    description:
      "Learn piano, guitar, or other instruments with flexible home or virtual lessons.",
  },
  {
    icon: "/icons/Services/SwimInstructor.svg",
    title: "Swim Instructors",
    description:
      "Safety-focused swimming lessons with certified professionals.",
  },
  {
    icon: "/icons/Services/HouseManager.svg",
    title: "House Managers",
    description:
      "Trusted help with organization, schedules, and household tasks.",
  },
];

function Services() {
  return (
    <div className="container">
      <h1 className="Livvic-Bold text-5xl leading-[80px]">
        Care Options That Fit Your Life
      </h1>
      <h2 className="Livvic text-[#00000099] text-xl">
        Every family has different needs. We help you find care that actually
        fits yours.
      </h2>
      <div className="flex flex-wrap gap-6 mt-12">
        {services.map((service) => (
          <ServicesCard
            key={service.title}
            title={service.title}
            description={service.description}
            icon={service.icon}
          />
        ))}
      </div>
    </div>
  );
}

export default Services;
