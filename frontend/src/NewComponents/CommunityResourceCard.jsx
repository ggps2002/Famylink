import { Clock } from "lucide-react";
import React from "react";

function CommunityResourceCard({ title, exerpt, author, replyCount, time }) {
  return (
    <div className="rounded-2xl p-6 bg-white w-[30rem]">
      <p className="text-[#00333B] text-lg Livvic-SemiBold">{title}</p>
      <p className="text-[#5C6566] text-md Livvic mt-2">{exerpt}</p>
      <div className="Livvic mt-4 flex justify-between text-sm">
        <div className="flex gap-2 items-center text-[#5C6566] Livvic-Medium">
          <img src="/mock_user1.svg" alt="user" />
          {author}
        </div>
        <div className="flex gap-1 items-center">
          <img src="/comment.svg" alt="replies" />
          <div className="flex gap-1">
            <p className="text-[#5C6566] Livvic">{replyCount}</p>
            <p className="text-[#5C6566] Livvic">replies</p>
          </div>
        </div>
        <div className="flex gap-1 items-center Livvic">
          <Clock color="gray" className="h-5 w-5" />
          <div className="flex gap-1">
            <p className="text-[#5C6566] Livvic">{time}</p>
            <p className="text-[#5C6566] Livvic">ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityResourceCard;
