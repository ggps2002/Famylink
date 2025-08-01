import React from 'react'
import ServicesCard from '../ServicesCard';

const services = [
  {
    icon: "/icons/Services/Nanny4.svg",
    title: "Connect With Families",
    description:
      "Quickly find families looking for exactly what you offer.",
  },
  {
    icon: "/icons/Services/Babysitter.svg",
    title: "Flexible Job Types",
    description: "Choose full-time, part-time, seasonal, or just weekends.",
  },
  {
    icon: "/icons/Services/PrivateEducator.svg",
    title: "Supportive Community",
    description:
      "Meet other caregivers, share advice, and grow together.",
  },
  {
    icon: "/icons/Services/SpecializedCaregiver.svg",
    title: "Professional Tools",
    description:
      "Get resources to build your career—resume tips, contracts, and more.",
  },
];

function Services() {
  return (
     <div className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="sm:text-left max-w-4xl mx-auto sm:mx-0">
        <h1 className="Livvic-Bold text-4xl sm:text-4xl md:text-5xl leading-tight sm:leading-[50px] md:leading-[60px] lg:leading-[80px] mb-4 sm:mb-6">
         Why Join Famlink
        </h1>
        <h2 className="Livvic text-[#00000099] text-lg sm:text-xl max-w-2xl mx-auto sm:mx-0 mb-8 sm:mb-10 lg:mb-12">
          We connect caregivers with jobs that fit their talents—and support their growth.
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
  )
}

export default Services