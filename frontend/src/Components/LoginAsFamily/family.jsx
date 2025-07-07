import { Outlet, useLocation } from "react-router-dom";
import FilterSliders from "../subComponents/filter";
import ProfileList from "./subcomponents/paginationforprofileData";
import s1 from "../../assets/images/s1.png";
import FrequentAskQuestion from "../subComponents/frequentAskQues";
import { useState } from "react";
import { useSelector } from "react-redux";
import { CustomSelect } from "../subComponents/customSelect";

export default function Family() {
  const { pathname } = useLocation();

  const { user } = useSelector((s) => s.auth);
  const budgetRange = user?.additionalInfo
    .find((info) => info.key === "totalBudget")
    ?.value.option.split("to")
    .map((value) => parseFloat(value.trim()));

  const [location, setLocation] = useState(5);
  const [priceRange, setPriceRange] = useState(
    budgetRange ? (budgetRange ? [0, budgetRange[1]] : [0, 100]) : [0, 100]
  );
  const [availability, setAvailability] = useState([]);
  const [careOptions, setCareOptions] = useState([]);
  const [services, setServices] = useState([]);
  const [start, setStart] = useState([]);

  const handleLocationChange = (value) => {
    setLocation(value);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleAvailabilityChange = (value) => {
    setAvailability(value);
  };

  const handleCareChange = (value) => {
    setCareOptions(value);
  };

  const handleStartChange = (value) => {
    setStart(value);
  };

  const handleServicesChange = (value) => {
    setServices(value);
  };

  // Check if the current path is a child route
  const isChildRoute = pathname.includes("/family/");
  const faq = [
    {
      question:
        "Is FamyLink only for finding nannies, or can I hire other types of caregivers?",
      answer:
        "FamyLink helps families connect with a variety of caregivers, including private educators, swim instructors, music teachers, and household managers.Whether you need a full- time nanny, a part - time tutor, or a weekend babysitter, you can find the right fit for your needs.",
    },
    {
      question:
        "Can I hire a caregiver who also teaches my child a skill, like a second language or piano?",
      answer:
        "Absolutely! Many caregivers on FamyLink offer additional skills beyond childcare. You can specify your preferences when posting a job or searching for candidates.",
    },
    {
      question: " Can I see caregiver rates before messaging them?",
      answer:
        "Yes! Caregiver profiles display their hourly rates, availability, and any additional services they offer, helping you make an informed decision before reaching out.",
    },
    {
      question:
        "What happens if I hire someone and later decide they’re not the right fit? ",
      answer:
        "If you need to make a change, FamyLink allows you to keep your job posting active and find a new caregiver easily. We also provide contract templates to help set clear expectations upfront.",
    },
  ];
  return (
    <div>
      {/* Render content only if it's NOT a child route */}
      {!isChildRoute && (
        <div className="padding-navbar1 Quicksand">
          <div className="lg:flex flex-wrap justify-between items-center">
            <p className="lg:my-8 mb-8 font-bold lg:text-4xl text-2xl Classico">
              Find your Perfect Nanny
            </p>
            {/* <div className="flex justify-end max-lg:mb-4">
              <CustomSelect
                placeholder="Recently Posted"
                options={["1 day ago", "7 days ago", "15 days ago"]}
              />
            </div> */}
          </div>
          <div className="flex items-start max-lg:flex-col gap-y-4">
            <FilterSliders
              onLocationChange={handleLocationChange}
              onPriceChange={handlePriceChange}
              onAvailabilityChange={handleAvailabilityChange}
              onCareChange={handleCareChange}
              onServicesChange={handleServicesChange}
              onStartChange={handleStartChange}
            />
            <ProfileList
              location={location}
              priceRange={priceRange}
              availability={availability}
              services={services}
              careOptions={careOptions}
            />
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
}
