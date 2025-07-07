import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { CustomSelect } from "../subComponents/customSelect";
import FilterSlidersJobPost from "./Profile/filterSlide";
import ProfileList from "./Profile/profileList";

export default function Nanny() {
  const { pathname } = useLocation();

  const [location, setLocation] = useState(5);
  const [priceRange, setPriceRange] = useState([5, 50]);
  const [availability, setAvailability] = useState([]);
  const [careOptions, setCareOptions] = useState([]);
  const [services, setServices] = useState([]);
  // const [start, setStart] = useState([]);
  const [maxChildren, setMaxChildren] = useState(null);

  const handleLocationChange = (value) => {
    setLocation(value);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleAvailabilityChange = (value) => {
    setAvailability(value);
  };

  // const handleStartChange = (value) => {
  //   setStart(value);
  // };

  const handleMaxAgeChange = (value) => {
    setMaxChildren(value);
  };
  const handleCareChange = (value) => {
    setCareOptions(value);
  };

  const handleServicesChange = (value) => {
    setServices(value);
  };

  // Check if the current path is a child route
  const isChildRoute = pathname.includes("/nanny/");

  return (
    <div>
      {/* Render content only if it's NOT a child route */}
      {!isChildRoute && (
        <div className="padding-navbar1 Quicksand">
          <div className="lg:flex flex-wrap justify-between items-center">
            <p className="lg:my-8 mb-8 font-semibold text-4xl">Find your Perfect Job</p>
            {/* <div className="flex justify-end max-lg:mb-4">
              <CustomSelect
                placeholder="Recently Posted"
                options={["1 day ago", "7 days ago", "15 days ago"]}
              />
            </div> */}
          </div>
          <div className="flex items-start max-lg:flex-col gap-y-4">
            <FilterSlidersJobPost
              onLocationChange={handleLocationChange}
              onPriceChange={handlePriceChange}
              onAvailabilityChange={handleAvailabilityChange}
              onCareChange={handleCareChange}
              onServicesChange={handleServicesChange}
              maxChildrenChange={handleMaxAgeChange}
            />
            <ProfileList
              location={location}
              priceRange={priceRange}
              availability={availability}
              services={services}
              careOptions={careOptions}
              maxChildren={maxChildren} />
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
}
