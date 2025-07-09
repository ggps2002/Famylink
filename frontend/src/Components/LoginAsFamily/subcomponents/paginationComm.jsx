import React from "react";
import { Dislike, Like, Reply } from "../../../assets/icons";

function PaginationComm() {
  return (
    <div className="w-full px-4 md:px-8 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-3">Post 1</h2>
            <p className="text-gray-700 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute
              irure dolor in reprehenderit in voluptate velit esse cillum
              dolore.
            </p>
            <div className="text-sm text-gray-500">
              Created by: Admin <br />
              Posted on: 20 June 2024 @ 9:30am
            </div>
            <div className="flex gap-6 mt-4 text-gray-600 text-lg">
              <div className="flex gap-2">
                <img src={Like} alt="like" />
                <span className="cursor-pointer">25</span>
              </div>
              <div className="flex gap-2">
                <img src={Dislike} alt="dislike" />
                <span className="cursor-pointer">5</span>
              </div>
              <div className="flex gap-2">
                <img src={Reply} alt="reply" />
                <span className="cursor-pointer">Reply</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER CONTENT */}
        <div className="lg:col-span-6 space-y-6">
          {/* Write New Post */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/100"
                alt="user"
                className="rounded-full w-12 h-12"
              />
              <input
                type="text"
                placeholder="Write your post.........."
                className="w-full border border-gray-300 rounded-full px-6 py-3 text-[18px] focus:outline-none"
              />
            </div>
            <button className="mt-3 text-blue-500 text-lg">
              📷 Photo/Video
            </button>
          </div>

          {/* Reply Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col min-h-[400px]">
            {/* Content */}
            <div className="flex gap-4 overflow-auto">
              <div className="overflow-y-auto pr-2 max-h-[800px]">
                {Array(6)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-4 border-b last:border-b-0 p-6"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 1}`}
                        alt="user"
                        className="rounded-full w-12 h-12 flex-shrink-0"
                      />
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Henry Dillon
                        </h2>
                        <p className="text-gray-700">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Sed, neque? Veniam quaerat debitis, sequi
                          reiciendis, iusto officia eius perferendis similique
                          quod voluptates nihil nemo molestias non fuga
                          voluptatem unde quos nam quia esse explicabo.
                          Quibusdam tenetur sapiente alias ea exercitationem
                          consectetur nam!
                        </p>
                        <div className="text-sm text-gray-500 mt-4">
                          Posted on: 20 June 2024 @ 9:30am
                        </div>
                        <div className="flex gap-6 mt-4 text-gray-600 text-lg">
                          <div className="flex gap-2">
                            <img src={Like} alt="like" />
                            <span className="cursor-pointer">25</span>
                          </div>
                          <div className="flex gap-2">
                            <img src={Dislike} alt="dislike" />
                            <span className="cursor-pointer">5</span>
                          </div>
                          <div className="flex gap-2">
                            <img src={Reply} alt="reply" />
                            <span className="cursor-pointer">Reply</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Reply Input Pinned at Bottom */}
            <div className="mt-auto pt-4 border-t">
              <div className="flex items-center gap-4">
                <img
                  src="https://i.pravatar.cc/100"
                  alt="user"
                  className="rounded-full w-12 h-12"
                />
                <input
                  type="text"
                  placeholder="Reply to post1"
                  className="w-full border border-gray-300 rounded-full px-6 py-3 text-[18px] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Suggested Topics</h2>
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <p
                  key={i}
                  className="text-gray-700 border-b py-3 last:border-b-0"
                >
                  Lorem ipsum dolor sit amet.
                  <span className="block text-sm text-gray-400">3h</span>
                </p>
              ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Local Events</h2>
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <p
                  key={i}
                  className="text-gray-700 border-b py-3 last:border-b-0"
                >
                  Lorem ipsum dolor sit amet.
                  <span className="block text-sm text-gray-400">3h</span>
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginationComm;
