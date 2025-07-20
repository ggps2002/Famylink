import React from "react";
import Button from "../Button";
import CommunityResourceCard from "../CommunityResourceCard";

const communityResource = [
  {
    title: "How do you handle screen time guilt as a working parent?",
    excerpt:
      "“I used to feel so bad letting my 4-year-old watch cartoons while I worked from home. Then I realized…”",
    author: "@OaklandMom",
    replyCount: 36,
    time: "3h",
  },
  {
    title: "How do you handle screen time guilt as a working parent?",
    excerpt:
      "“I love the kids I work with, but sometimes I’m expected to do extra tasks like laundry or errands that weren’t part of the original agreement…”",
    author: "@NannyTracy",
    replyCount: 36,
    time: "3h",
  },
  {
    title: "How do you handle screen time guilt as a working parent?",
    excerpt:
      "“I used to feel so bad letting my 4-year-old watch cartoons while I worked from home. Then I realized…”",
    author: "@OaklandMom",
    replyCount: 36,
    time: "3h",
  },
];

function Community() {
  return (
    <div className="container Livvic">
      <div className="flex justify-between mt-12">
        <div>
          <h1 className="Livvic-Bold text-5xl">Community Resources</h1>
          <p className="text-[20px] text-[#00000099] Livvic mt-6">
            Every family has different needs. We help you find care that
            actually fits yours.
          </p>
        </div>
        <div>
          <Button
            btnText={"Explore the Community"}
            className="bg-[#9FEEF8] text-[#00333B] "
          />
        </div>
      </div>
      <div className="flex gap-4 my-6">
        <div className="p-4 rounded-full bg-[#9FEEF8] text-[#00333B] Livvic-SemiBold">
          Tips for Parents
        </div>
        <div className="p-4 rounded-full bg-[#DEF1F4] text-[#00000099] Livvic-SemiBold">
          Tips for Nannies
        </div>
        <div className="p-4 rounded-full bg-[#DEF1F4] text-[#00000099] Livvic-SemiBold">
          Platform Tips
        </div>
        <div className="p-4 rounded-full bg-[#DEF1F4] text-[#00000099] Livvic-SemiBold">
          Special Needs Care
        </div>
        <div className="p-4 rounded-full bg-[#DEF1F4] text-[#00000099] Livvic-SemiBold">
          Do it Yourself
        </div>
        <div className="p-4 rounded-full bg-[#DEF1F4] text-[#00000099] Livvic-SemiBold">
          Nanny Activities
        </div>
        <div className="p-4 rounded-full bg-[#DEF1F4] text-[#00000099] Livvic-SemiBold">
          News
        </div>
      </div>
      <div className="flex gap-4">
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
