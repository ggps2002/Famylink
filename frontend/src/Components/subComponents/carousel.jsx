import img1 from "../../assets/images/s1.png";
import img2 from "../../assets/images/par2.jpg";
import img3 from "../../assets/images/par3.jpg";
import img4 from "../../assets/images/par4.jpg";
import { useEffect, useState } from "react";
import { Rate } from "antd";

const testimonials = [
  {
    img: img1,
    fallbackImageText: "ER",
    para: `"Famlink's matching system found us the perfect nanny who shares our values 
about outdoor play and healthy eating. It's been 2 years and we couldn't be 
happier with the compatibility!`,
    name: "Emily R., San Francisco, CA",
    relation: "Perfect compatibility match",
  },
  {
    img: img2,
    fallbackImageText: "DL",
    para: `Finding a math tutor who could work with our learning-different son seemed 
impossible. Famlink matched us with James who has the exact patience and 
approach our son needed.`,
    name: "DavidL., Brooklyn, NY",
    relation: "~$1,800 monthly savings",
  },
  {
    img: img3,
    fallbackImageText: "PM",
    para: `We needed a piano teacher for our daughter, and Famlink found someone who 
matches our family's classical music preferences perfectly. She's been with us for 
18 months now.`,
    name: "PriyaM., Chicago, IL",
    relation: "Long-term relationship success",
  },
  // {
  //   img: img4,
  //   para: "I loved being able to post exactly what we needed. We got multiple great applicants within days.",
  //   name: "Nina R.",
  //   relation: "Single Mom",
  // },
];

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setFade(false);
      }, 300); // duration of fade-out
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(false);
    }, 300);
  };

  const { img, fallbackImageText, para, name, relation } =
    testimonials[currentIndex];

  return (
    <div className="pb-8 bg-white">
      <div
        className={`transition-opacity duration-500 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex flex-col md:flex-row items-start justify-center gap-8 px-4">
          {/* <img
            src={img}
            alt={name}
            className="w-32 h-32 max-lg:mx-auto object-cover rounded-full shadow-md"
          /> */}
          <div className="w-fit h-fit p-6 max-lg:mx-auto rounded-full shadow-md bg-gray-200 text-xl font-semibold text-gray-700 text-center leading-none">
            <div className="flex justify-center items-center ">
              {fallbackImageText}
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="text-gray-800 text-base md:text-lg text-left">
              {para}
            </p>
            <div className="flex flex-col justify-right items-start">
              <Rate className="pt-2" disabled defaultValue={5} />
            </div>
            <div className="text-right  mt-6">
              <p className="font-medium text-xl">{name}</p>
              <p className="text-sm text-gray-500">Highlight: {relation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-gray-300 h-4 w-4" : "bg-gray-300 h-2 w-2"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
