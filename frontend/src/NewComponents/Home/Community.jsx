import React from "react";
import Button from "../Button";
import CommunityResourceCard from "../CommunityResourceCard";
import { NavLink } from "react-router-dom";

const communityResource = [
  {
    title: "How do you handle screen time guilt as a working parent?",
    excerpt:
      '"I used to feel so bad letting my 4-year-old watch cartoons while I worked from home. Then I realized..."',
    author: "@OaklandMom",
    replyCount: 36,
    time: "3h",
  },
  {
    title: "How do you handle screen time guilt as a working parent?",
    excerpt:
      "\"I love the kids I work with, but sometimes I'm expected to do extra tasks like laundry or errands that weren't part of the original agreement...\"",
    author: "@NannyTracy",
    replyCount: 36,
    time: "3h",
  },
  {
    title: "How do you handle screen time guilt as a working parent?",
    excerpt:
      '"I used to feel so bad letting my 4-year-old watch cartoons while I worked from home. Then I realized..."',
    author: "@OaklandMom",
    replyCount: 36,
    time: "3h",
  },
];

function Community() {
  return (
    <div className="container Livvic px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between mt-6 sm:mt-12 gap-4 sm:gap-0">
        <div>
          <h1 className="Livvic-Bold text-4xl sm:text-5xl">
            Community Resources
          </h1>
          <p className="text-lg sm:text-[20px] text-[#00000099] Livvic mt-4 sm:mt-6">
            Every family has different needs. We help you find care that
            actually fits yours.
          </p>
        </div>
        <div className="sm:self-start">
          <NavLink to="/joinNow">
            <Button
              btnText={"Explore the Community"}
              className="bg-[#9FEEF8] text-[#00333B] w-full sm:w-auto"
            />
          </NavLink>
        </div>
      </div>

      <div className="flex gap-3 sm:gap-4 my-4 sm:my-6 overflow-x-auto pb-2 sm:pb-0 scrollbar-custom">
        <div className="p-3 sm:p-4 rounded-full bg-[#9FEEF8] text-[#00333B] Livvic-SemiBold whitespace-nowrap text-sm sm:text-base">
          Tips for Parents
        </div>
        <div className="p-3 sm:p-4 rounded-full bg-[#DEF1F4] text-[#00000099] Livvic-SemiBold whitespace-nowrap text-sm sm:text-base">
          Tips for Nannies
        </div>
        <div className="p-3 sm:p-4 rounded-full bg-[#DEF1F4] text-[#00000099] Livvic-SemiBold whitespace-nowrap text-sm sm:text-base">
          Platform Tips
        </div>
        <div className="p-3 sm:p-4 rounded-full bg-[#DEF1F4] text-[#00000099] Livvic-SemiBold whitespace-nowrap text-sm sm:text-base">
          Special Needs Care
        </div>
        <div className="p-3 sm:p-4 rounded-full bg-[#DEF1F4] text-[#00000099] Livvic-SemiBold whitespace-nowrap text-sm sm:text-base">
          Do it Yourself
        </div>
        <div className="p-3 sm:p-4 rounded-full bg-[#DEF1F4] text-[#00000099] Livvic-SemiBold whitespace-nowrap text-sm sm:text-base">
          Nanny Activities
        </div>
        <div className="p-3 sm:p-4 rounded-full bg-[#DEF1F4] text-[#00000099] Livvic-SemiBold whitespace-nowrap text-sm sm:text-base">
          News
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {communityResource.map((resource, i) => (
          <CommunityResourceCard
            key={i}
            title={resource.title}
            exerpt={resource.excerpt}
            author={resource.author}
            time={resource.time}
            replyCount={resource.replyCount}
          />
        ))}
      </div>
    </div>
  );
}

export default Community;
