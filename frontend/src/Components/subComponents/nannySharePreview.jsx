import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatedWrapper } from "./animation";
import { Spin, Input } from "antd";
import { Search, Star } from "lucide-react";
import { fireToastMessage } from "../../toastContainer";

const nannyShares = [
  {
    families: "The Patel & Sharma Families",
    location: "San Jose",
    price: "$1,400/month per family",
    savings: "save $1,000+ each",
    schedule: "Monday–Friday, 9am–5pm",
    ages: "Ages 1–4",
    description: "Looking for a bilingual nanny who loves music & crafts.",
    action: "Contact Families – Sign Up Required",
  },
  {
    families: "The Li & Wang Families",
    location: "Seattle",
    price: "$1,100/month per family",
    savings: "save $900+ each",
    schedule: "Tuesday–Friday, 8am–3pm",
    ages: "Ages 2–3",
    description: "Seeking gentle, Montessori-aligned caregiver.",
    action: "Contact Families – Sign Up Required",
  },
  {
    families: "The Robinson & Johnson Families",
    location: "Chicago",
    price: "$1,250/month per family",
    savings: "save $1,300+ each",
    schedule: "Monday–Thursday, 7:30am–5:30pm",
    ages: "Ages 1–5",
    description: "Cozy home setup, walkable parks nearby.",
    action: "Contact Families – Sign Up Required",
  },
  {
    families: "The Nguyen & Tran Families",
    location: "Austin",
    price: "$1,300/month per family",
    savings: "save $1,200+ each",
    schedule: "Monday–Friday, 8am–6pm",
    ages: "Ages 3–6",
    description: "Nanny must love storytime and outdoor play.",
    action: "Contact Families – Sign Up Required",
  },
  {
    families: "The Garcia & Hernandez Families",
    location: "Los Angeles",
    price: "$1,200/month per family",
    savings: "save $1,100+ each",
    schedule: "Monday–Friday, 9am–6pm",
    ages: "Ages 2–4",
    description: "Warm home near Griffith Park; Spanish-speaking preferred.",
    action: "Contact Families – Sign Up Required",
  },
  {
    families: "The Cohen & Levy Families",
    location: "New York City",
    price: "$1,500/month per family",
    savings: "save $1,200+ each",
    schedule: "Monday–Friday, 8am–5pm",
    ages: "Ages 1–3",
    description: "Looking for reliable nanny familiar with kosher homes.",
    action: "Contact Families – Sign Up Required",
  },
];

const nannyShareOpportunities = [
  {
    families: "The Johnson & Martinez Families",
    location: "Park Slope",
    rate: "$1,200/month per family",
    savings: "save $1,200+ each",
    schedule: "Monday–Friday, 8am–6pm",
    kids: "4 kids (ages 2–5)",
    description: "Two families seeking warm, experienced nanny...",
    cta: "Contact Families – Sign Up Required",
  },
  // Add 2–3 more objects similarly if needed
];

const serviceProvidersDetails = [
  {
    name: "Maria S.",
    role: "Nanny",
    rating: 5,
    rate: "$23/hour",
    availability: "Full-time available",
    experience: "6 years experience",
    description: "Bilingual care, Montessori background...",
    service: "Full-time childcare",
    cta: "View Full Profile",
  },
  {
    name: "James T.",
    role: "Math Tutor",
    rating: 5,
    rate: "$45/hour",
    availability: "After-school available",
    experience: "Algebra specialist",
    description: "Specializes in algebra and geometry...",
    service: "Academic support",
    cta: "View Teaching Profile",
  },
  {
    name: "Lisa K.",
    role: "Piano Instructor",
    rating: 5,
    rate: "$60/lesson",
    availability: "Weekend slots",
    experience: "10 years experience",
    description: "Patient approach, classical training...",
    service: "Music education",
    cta: "View Full Profile",
  },
];

export default function NannySharePreview({ border, head, btn, type }) {
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [visibleShares, setVisibleShares] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [nannySharePreview, setNannySharePreview] = useState([]);

  const getRandomShares = () => {
    if (type === "NannyShare") {
      return nannyShareOpportunities;
    }
    if (type === "service") {
      return serviceProvidersDetails;
    }
    const shuffled = [...nannyShares].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const handleZipValidation = async (zip) => {
    if (!zip) return;

    setLoading(true);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);

      if (!res.ok) throw new Error("Invalid ZIP");
      const data = await res.json();
      console.log("Zip", data);
      const finalZip = data["post code"];
      if (finalZip) {
        setZipCode(finalZip);
        setVisibleShares(getRandomShares()); // 👉 show 3 new cards
        setServiceProviders(getRandomShares());
        setNannySharePreview(getRandomShares());
        // form.setFieldsValue({
        //   zipCode: finalZip,
        // });
      } else {
        throw new Error("Invalid structure");
      }
    } catch (err) {
      setZipCode("");
      setVisibleShares([]); // clear cards on error
      setServiceProviders([]);
      setNannySharePreview([]);
      // form.setFieldsValue({ zipCode: "" });
      fireToastMessage({
        type: "error",
        message: "Invalid ZIP code. Please enter a valid U.S. ZIP.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="relative flex  justify-center items-center text-center">
        <div>
          <AnimatedWrapper
            animationConfig={{
              from: { opacity: 0, y: -50 },
              to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
            }}
          >
            <p
              style={{
                borderBottom: !border && "16px solid #DEEBEB",
                display: "inline-block",
              }}
              className="px-3 font-normal uppercase Classico offer-font text-center lg:leading-[12px] leading-tight"
            >
              {head}
            </p>
          </AnimatedWrapper>
          <div className="relative mt-12">
            {/* Optional: Wrap Spin over just the input for precise control */}
            <Spin
              spinning={loading}
              size="small"
              className="absolute z-10 left-3 top-1/2 -translate-y-1/2"
            />

            <Input
              name="zipCode"
              placeholder="Enter zip code"
              value={zipCode}
              onChange={(e) => {
                const zip = e.target.value;
                setZipCode(zip);
              }}
              onBlur={(e) => handleZipValidation(e.target.value.trim())}
              className="w-full p-4 pr-12 rounded-3xl input-width border border-gray-300"
              maxLength={10}
            />

            <Search className="absolute right-4 lg:right-[26%] top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="my-6 flex gap-2 flex-wrap">
        {type === "service" ? (
          <div className="py-10 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
            {serviceProviders.map((person, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between h-full"
              >
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                    {person.name}{" "}
                    <span className="text-sm text-gray-600">
                      – {person.role}
                    </span>
                  </h2>

                  <div className="flex items-center text-yellow-500 mt-1">
                    {[...Array(person.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 stroke-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="mt-2 text-sm text-gray-700">
                    {person.rate} • {person.availability} • {person.experience}
                  </p>

                  <p className="italic text-gray-600 mt-2">
                    "{person.description}"
                  </p>

                  <p className="mt-2 text-sm text-blue-800 font-medium">
                    Service: {person.service}
                  </p>
                </div>

                <button className="mt-auto bg-[#85D1F1] text-base px-4 py-1 rounded-full hover:scale-105 transition">
                  {person.cta}
                </button>
              </div>
            ))}
          </div>
        ) : type === "NannyShare" ? (
          nannySharePreview.map((share, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 space-y-3 max-w-md mx-auto"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {share.families}{" "}
                <span className="text-sm text-gray-500">
                  – {share.location}
                </span>
              </h3>
              <p className="text-green-600 font-bold text-lg">
                {share.rate}{" "}
                <span className="text-sm text-gray-500">({share.savings})</span>
              </p>
              <p className="text-sm text-gray-600">
                {share.schedule} • {share.kids}
              </p>
              <p className="text-gray-700 italic">"{share.description}"</p>
              <button className="mt-2 bg-[#85D1F1] text-white text-sm px-4 py-2 rounded-full hover:scale-105 transition">
                {share.cta}
              </button>
            </div>
          ))
        ) : (
          visibleShares.map((share, index) => (
            <div
              key={index}
              className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {share.families}
              </h2>
              <p className="text-lg font-bold text-green-600">
                {share.price}{" "}
                <span className="text-sm text-gray-500">({share.savings})</span>
              </p>
              <p className="text-sm text-gray-600">
                {share.schedule} • {share.ages}
              </p>
              <p className="text-gray-700">{share.description}</p>
              <NavLink
                to="joinNow"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <button className="bg-[#85D1F1] text-base px-4 py-1 rounded-full hover:scale-105 transition">
                  {share.action}
                </button>
              </NavLink>
            </div>
          ))
        )}
      </div>
      {type !== "service" ||
        (type !== "NannyShare" && (
          <p className="text-sm text-center text-gray-600">
            Looking for individual care? Browse our network of nannies,
            babysitters, and specialized caregivers below.
          </p>
        ))}
    </>
  );
}
