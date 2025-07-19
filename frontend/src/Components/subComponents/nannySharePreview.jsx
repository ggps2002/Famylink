import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatedWrapper } from "./animation";
import { Spin, Input } from "antd";
import { Search, Star } from "lucide-react";
import { fireToastMessage } from "../../toastContainer";
import { api } from "../../Config/api";

const jobSeekerOpportunities = [
  {
    title: "Nanny Position – Manhattan Family",
    rate: "$22–25/hour",
    type: "Full-time",
    action: "View Details – Sign Up Required",
  },
  {
    title: "Babysitter – Brooklyn",
    rate: "$18–20/hour",
    type: "Part-time",
    action: "View Details – Sign Up Required",
  },
  {
    title: "Nanny Share – Queens",
    rate: "$40+/hour total earning potential",
    type: null,
    action: "View Details – Sign Up Required",
  },
];

const nannyShares = [
  {
    name: "Sarah M.",
    title: "Experienced Nanny",
    rating: "★★★★★",
    rate: "$22–25/hour",
    availability: "Full-time available",
    experience: "5 years experience",
    description: "Warm, nurturing care with focus on outdoor activities...",
    action: "View Full Profile",
    profileType: "childcare",
  },
  {
    name: "James T.",
    title: "Math Tutor",
    rating: "★★★★★",
    rate: "$45/hour",
    availability: "After-school availability",
    experience: "Algebra specialist",
    description: "Specializes in algebra and geometry for middle schoolers...",
    action: "View Teaching Profile",
    profileType: "teaching",
  },
  {
    name: "David L.",
    title: "Soccer Coach",
    rating: "★★★★★",
    rate: "$40/session",
    availability: "Weekend availability",
    experience: "Former college player",
    description: "Former college player, great with ages 6–12...",
    action: "View Full Profile",
    profileType: "sports",
  },
];

const nannyShareOpportunities = [
  {
    families: "The Johnson & Martinez Families",
    location: "Park Slope",
    rate: "$1,200/month per family",
    savings: "Compatible Families",
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
  const [jobSeekerPreview, setJobSeekerPreview] = useState([]);

  const getRandomShares = async (zip) => {
    if (type === "jobSeeker") {
      try {
        const { data } = await api.get(`postJob/job-seeker-opportunities/${zip}`);
        console.log("jobs", data);
        const response = data?.data || [];
        const shuffled = [...response].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
      } catch (error) {
        console.error("Error fetching service providers:", error);
        fireToastMessage({
          type: "error",
          message: "Could not load service providers. Try again later.",
        });
        return [];
      }
    }
    if (type === "NannyShare") {
         try {
        const { data } = await api.get(`nannyShare/nanny-share-opportunities/${zip}`);
        console.log("jobs", data);
        const response = data?.data || [];
        const shuffled = [...response].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
      } catch (error) {
        console.error("Error fetching service providers:", error);
        fireToastMessage({
          type: "error",
          message: "Could not load service providers. Try again later.",
        });
        return [];
      }
    }
    if (type === "service") {
      try {
        const { data } = await api.get(`userData/service-providers/${zip}`);
        const response = data?.data || [];
        const shuffled = [...response].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
      } catch (err) {
        console.error("Error fetching service providers:", err);
        fireToastMessage({
          type: "error",
          message: "Could not load service providers. Try again later.",
        });
        return [];
      }
      // return serviceProvidersDetails;
    } else {
      try {
        const { data } = await api.get(`userData/service-providers/${zip}`);
        const response = data?.data || [];
        const shuffled = [...response].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
      } catch (err) {
        console.error("Error fetching service providers:", err);
        fireToastMessage({
          type: "error",
          message: "Could not load service providers. Try again later.",
        });
        return [];
      }
    }
  };

  const handleZipValidation = async (zip) => {
    if (!zip) return;

    setLoading(true);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);

      if (!res.ok) throw new Error("Invalid ZIP");
      const data = await res.json();
      const finalZip = data["post code"];
      if (finalZip) {
        setZipCode(finalZip);
        setVisibleShares(await getRandomShares(finalZip)); // 👉 show 3 new cards
        setServiceProviders(await getRandomShares(finalZip));
        setNannySharePreview(await getRandomShares(finalZip));
        setJobSeekerPreview(await getRandomShares(finalZip));
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
      setJobSeekerPreview([]);
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

            <Search className="absolute right-4 lg:right-[30%] top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
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
                    {person.rate} • {person.availability?.option} •{" "}
                    {person.experience?.option || "Experience not specified"}
                  </p>

                  <p className="italic text-gray-600 mt-2">
                    "{person.description.slice(0, 20)}..."
                  </p>

                  <p className="mt-2 text-sm text-blue-800 font-medium">
                    Service: {person.service}
                  </p>
                </div>

                <NavLink
                  to="joinNow"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <button className="mt-auto bg-[#85D1F1] text-base px-4 py-1 rounded-full hover:scale-105 transition">
                    {person.cta}
                  </button>
                </NavLink>
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
        ) : type === "jobSeeker" ? (
          <div className="flex md:gap-6 gap-2 flex-col md:flex-row">
            {jobSeekerPreview.map((job, index) => (
              <div key={index} className="mb-6 text-sm md:text-base">
                <p className="font-semibold text-gray-800">{job.title}</p>
                <p className="text-green-600 font-medium">
                  {job.rate}
                  {job.type && `• ${job.type}`}
                </p>
                <NavLink
                  to="joinNow"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <button className="mt-1 underline text-[#0077b6] hover:text-[#023e8a] text-sm">
                    [{job.action}]
                  </button>
                </NavLink>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {visibleShares.map((provider, index) => (
              <div key={index} className="mb-6 text-sm md:text-base">
                <p className="font-semibold text-gray-800">
                  {provider.name} – {provider.role}{" "}
                  <div className="flex items-center text-yellow-500 mt-1">
                    {[...Array(provider.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 stroke-yellow-400"
                      />
                    ))}
                  </div>
                </p>
                <p className="text-green-600 font-medium">
                  {provider.rate} • {provider.availability?.option} •{" "}
                  {provider.experience?.option}
                </p>
                <p className="italic text-gray-700">
                  "{provider.description.slice(0, 20)}..."
                </p>
                <NavLink
                  to="joinNow"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <button className="mt-1 underline text-[#0077b6] hover:text-[#023e8a] text-sm">
                    [{provider.cta}]
                  </button>
                </NavLink>
              </div>
            ))}
          </div>
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
