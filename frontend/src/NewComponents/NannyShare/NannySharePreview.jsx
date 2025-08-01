import React from "react";
import CustomButton from "../Button";
import { NavLink } from "react-router-dom";
import ProfileCard from "../../Components/subComponents/profileCard";

const nannyData = [
    {
        imageUrl: "/nanny/nanny1.jpg",
        totalRatings: 126,
        averageRating: 5,
        time: "Full Time",
        name: "Sheena F.",
        intro: "Hi! I’m Sheena, a full-time nanny with 7 years of experience supporting families with children aged 6 months to 10 years. I bring a calm, playful energy...",
        exp: "3 years",
        loc: "Long Island City, Queens"
    },
     {
        imageUrl: "/nanny/nanny2.jpg",
        totalRatings: 126,
        averageRating: 5,
        time: "Full Time",
        name: "Jennie M.",
        intro: "I’m Jennie — a caregiver and former educator who blends academic support with engaging care. Whether it’s math homework or after-school play, I’m here to make your child feel supported and confident.",
        exp: "3 years",
        loc: "Long Island City, Queens"
    },
     {
        imageUrl: "/nanny/nanny3.jpg",
        totalRatings: 126,
        averageRating: 5,
        time: "Full Time",
        name: "Alisa M.",
        intro: "Hi, I’m Alisa — a certified newborn care provider with a passion for helping new parents feel rested, informed, and cared for. From feeding to sleep routines, I offer gentle, attentive support.",
        exp: "3 years",
        loc: "Long Island City, Queens"
    },
     {
        imageUrl: "/nanny/nanny4.jpg",
        totalRatings: 126,
        averageRating: 5,
        time: "Full Time",
        name: "Tasha S.",
        intro: "My name is Tasha, and I specialize in working with neurodiverse kids, including those with autism and ADHD. I focus on empathy, consistency, and building trust through everyday moments.",
        exp: "3 years",
        loc: "Long Island City, Queens"
    }
] 

function NannySharePreview() {
  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="flex flex-col sm:flex-row sm:justify-between mt-6 sm:mt-12 gap-4 sm:gap-0">
        <div>
          <h1 className="Livvic-Bold text-4xl sm:text-5xl">
            Nannies Open to <br className="hidden lg:block"/>Sharing Arrangements
          </h1>
        </div>
        <div className="sm:self-start">
          <NavLink to="/joinNow">
            <CustomButton
              btnText={"Explore More"}
              className="bg-[#FFADE1] text-[#00333B] w-full sm:w-auto"
            />
          </NavLink>
        </div>
      </div>
      <div className="flex flex-wrap mt-12 gap-6">
        {
            nannyData.map((nanny, i) => (
                <ProfileCard
                    key={i}
                    totalRatings={nanny.totalRatings}
                    img={nanny.imageUrl}
                    averageRating={nanny.averageRating}
                    time={nanny.time}
                    name={nanny.name}
                    intro={nanny.intro}
                    loc={nanny.loc}
                    exp={nanny.exp}
                   nanny={true}
                />
            ))
        }
      </div>
    </div>
  );
}

export default NannySharePreview;
