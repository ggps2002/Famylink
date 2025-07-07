import img1 from '../../assets/images/s1.png';
import img2 from '../../assets/images/par2.jpg';
import img3 from '../../assets/images/par3.jpg';
import img4 from '../../assets/images/par4.jpg';
import { useEffect, useState } from "react";
import { Rate } from "antd";

const testimonials = [
  {
    img: img1,
    para: "FamyLink helped us find a wonderful nanny who fit our schedule and parenting style. The whole process felt personal, not transactional.",
    name: "Samantha L.",
    relation: "Parent",
  },
  {
    img: img2,
    para: "We joined a nanny share through FamyLink and it was the best decision ever. Our daughter has a playmate, and we're saving money too!",
    name: "Alex & Jamie T.",
    relation: "Parent",
  },
  {
    img: img3,
    para: "It's so much more than just hiring. We found a nanny, a music instructor, and even connected with local parents through the community page.",
    name: "Maria G.",
    relation: "Parent of Two",
  },
  {
    img: img4,
    para: "I loved being able to post exactly what we needed. We got multiple great applicants within days.",
    name: "Nina R.",
    relation: "Single Mom",
  },
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

  const { img, para, name, relation } = testimonials[currentIndex];

  return (
    <div className="pb-8 bg-white">
      <div
        className={`transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"
          }`}
      >
        <div className="flex flex-col md:flex-row items-start justify-center gap-8 px-4">
          <img
            src={img}
            alt={name}
            className="w-32 h-32 max-lg:mx-auto object-cover rounded-full shadow-md"
          />
          <div className="max-w-3xl">
            <p className="text-gray-800 text-base md:text-lg text-left">{para}</p>
            <div className="flex flex-col justify-right items-start">
              <Rate className="pt-2" disabled defaultValue={5} />
            </div>
            <div className="text-right  mt-6">
              <p className="font-medium text-xl">{name}</p>
              <p className="text-sm text-gray-500">{relation}</p>
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
            className={`rounded-full transition-all duration-300 ${i === currentIndex ? "bg-gray-300 h-4 w-4" : "bg-gray-300 h-2 w-2"
              }`}
          ></button>
        ))}
      </div>
    </div>
  );
}

