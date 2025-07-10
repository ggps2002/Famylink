// PaginationComm.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "react-avatar";
import {
  fetchAllCommunityThunk,
  fetchPostByIdThunk,
  postCommentThunk,
  postCommLikeThunk,
  postCommDislikeThunk,
  postReplyLikeThunk,
  postCommentLikeThunk,
  postCommentDislikeThunk,
  postReplyDislikeThunk,
  replyPostReplyThunk,
  createPostThunk,
} from "../../Redux/communitySlice";
import { Dislike, Like, Reply } from "../../../assets/icons";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { api } from "../../../Config/api";

const PaginationComm = () => {
  const dispatch = useDispatch();
  const { data: communities, isLoading } = useSelector(
    (state) => state.community
  );
  const { user } = useSelector((state) => state.auth);

  const [activePostId, setActivePostId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [posts, setPosts] = useState([]);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [quotedText, setQuotedText] = useState(""); // for UI quote
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [postCreators, setPostCreators] = useState({});

  const handleCreatePost = async () => {
    if (!postContent.trim() || !selectedTopic) return;

    console.log("Anonymous:", isAnonymous);

    await dispatch(
      createPostThunk({
        description: postContent,
        topicId: selectedTopic,
        anonymous: isAnonymous,
      })
    );

    setPostContent("");
    setSelectedTopic("");
    setIsAnonymous(false);
    dispatch(fetchAllCommunityThunk());
  };

  useEffect(() => {
    dispatch(fetchAllCommunityThunk()).then(async (res) => {
      const communities = res.payload?.data?.data || [];
      const all = communities?.flatMap((comm) =>
        comm.topics.flatMap((topic) =>
          topic.posts.map((post) => ({
            ...post,
            topicId: topic._id,
            topicName: topic.name,
            communityId: comm._id,
          }))
        )
      );
      setPosts(all);

      // 🔽 Fetch user info for non-anonymous posts
      const uniqueUserIds = [
        ...new Set(
          all
            .map((p) => p.createdBy)
            .filter((id) => id && id !== "000000000000000000000000")
        ),
      ];

      const creatorMap = {};
      for (const userId of uniqueUserIds) {
        try {
          const res = await api.get(`/userData/getUserById/${userId}`);
          creatorMap[userId] = res.data?.data?.name || "User";
        } catch {
          creatorMap[userId] = "User";
        }
      }

      setPostCreators(creatorMap);
    });
  }, [dispatch]);

  const activePost = posts.find((p) => p._id === activePostId);

  const handlePostReply = () => {
    if (replyText.trim() && activePostId) {
      dispatch(postCommentThunk({ id: activePostId, comment: replyText })).then(
        () => {
          dispatch(fetchPostByIdThunk(activePostId)).then((res) => {
            const updated = res.payload?.data;
            if (updated) {
              setPosts((prev) =>
                prev.map((p) =>
                  p._id === updated._id
                    ? { ...p, comments: updated.comments }
                    : p
                )
              );
            }
          });
          setReplyText("");
        }
      );
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!activePostId || !commentId) return;

    try {
      await dispatch(postCommentLikeThunk({ postId: activePostId, commentId }));
      const res = await dispatch(fetchPostByIdThunk(activePostId));
      const updated = res.payload?.data;
      if (updated) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === updated._id ? { ...p, comments: updated.comments } : p
          )
        );
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleLike = async (postId) => {
    const post = posts.find((p) => p._id === postId);
    const hasLiked = post.likes?.includes(user._id);

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              likes: hasLiked
                ? p.likes.filter((id) => id !== user._id)
                : [...(p.likes || []), user._id],
            }
          : p
      )
    );

    try {
      await dispatch(postCommLikeThunk({ id: postId, comm: false }));
    } catch {
      // Optionally revert UI here
    }
  };

  const handleDislike = async (postId) => {
    const post = posts.find((p) => p._id === postId);
    const hasDisliked = post.dislikes?.includes(user._id);

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              dislikes: hasDisliked
                ? p.dislikes.filter((id) => id !== user._id)
                : [...(p.dislikes || []), user._id],
            }
          : p
      )
    );

    try {
      await dispatch(postCommDislikeThunk({ id: postId, comm: false }));
    } catch {
      // Optionally revert UI here
    }
  };

  const handleCommentDislike = async (commentId) => {
    if (!activePostId || !commentId) return;

    try {
      await dispatch(
        postCommentDislikeThunk({ postId: activePostId, commentId })
      );
      const res = await dispatch(fetchPostByIdThunk(activePostId));
      const updated = res.payload?.data;
      if (updated) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === updated._id ? { ...p, comments: updated.comments } : p
          )
        );
      }
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  const handleReplyLike = async (commentId, replyId) => {
    if (!activePostId || !commentId || !replyId) return;

    try {
      await dispatch(
        postReplyLikeThunk({ postId: activePostId, commentId, replyId })
      );
      const res = await dispatch(fetchPostByIdThunk(activePostId));
      const updated = res.payload?.data;
      if (updated) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === updated._id ? { ...p, comments: updated.comments } : p
          )
        );
      }
    } catch (error) {
      console.error("Error liking reply:", error);
    }
  };

  const handleReplyDislike = async (commentId, replyId) => {
    if (!activePostId || !commentId || !replyId) return;

    try {
      await dispatch(
        postReplyDislikeThunk({ postId: activePostId, commentId, replyId })
      );
      const res = await dispatch(fetchPostByIdThunk(activePostId));
      const updated = res.payload?.data;
      if (updated) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === updated._id ? { ...p, comments: updated.comments } : p
          )
        );
      }
    } catch (error) {
      console.error("Error disliking reply:", error);
    }
  };

  const handlePostCommentReply = () => {
    if (!replyText.trim()) return;

    if (replyToCommentId) {
      // 🔁 Nested reply to a comment
      dispatch(
        replyPostReplyThunk({
          postId: activePostId,
          commentId: replyToCommentId,
          reply: replyText,
        })
      ).then(() => {
        dispatch(fetchPostByIdThunk(activePostId)).then((res) => {
          const updated = res.payload?.data;
          if (updated) {
            setPosts((prev) =>
              prev.map((p) =>
                p._id === updated._id ? { ...p, comments: updated.comments } : p
              )
            );
          }
        });
        setReplyText("");
        setReplyToCommentId(null);
        setQuotedText("");
        setIsReplyModalOpen(false);
      });
    } else {
      // 🔁 Fallback to posting a top-level comment
      dispatch(postCommentThunk({ id: activePostId, comment: replyText })).then(
        () => {
          dispatch(fetchPostByIdThunk(activePostId)).then((res) => {
            const updated = res.payload?.data;
            if (updated) {
              setPosts((prev) =>
                prev.map((p) =>
                  p._id === updated._id
                    ? { ...p, comments: updated.comments }
                    : p
                )
              );
            }
          });
          setReplyText("");
          setIsReplyModalOpen(false);
        }
      );
    }
  };

  return (
    <div className="w-full mx-auto">
      {isLoading ? (
        <div className="text-center py-10">
          <span className="inline-block w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-3 space-y-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white border border-gray-200 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold mb-3">{post.topicName}</h2>
                <p className="text-gray-700 mb-4">{post.description || ""}</p>
                <div className="text-sm text-gray-500">
                  Created by:{" "}
                  {post.createdBy === "000000000000000000000000"
                    ? "anonymous"
                    : postCreators[post.createdBy] || "Loading..."}{" "}
                  <br />
                  Posted on: {new Date(post.createdAt).toLocaleString()}
                </div>
                <div className="flex gap-6 mt-4 text-gray-600 text-lg">
                  <div className="flex gap-2">
                    <img
                      src={Like}
                      alt="like"
                      className="cursor-pointer"
                      onClick={() => handleLike(post._id)}
                    />
                    <span>{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex gap-2">
                    <img
                      src={Dislike}
                      alt="dislike"
                      className="cursor-pointer"
                      onClick={() => handleDislike(post._id)}
                    />
                    <span>{post.dislikes?.length || 0}</span>
                  </div>
                  <div className="flex gap-2">
                    <img
                      src={Reply}
                      alt="reply"
                      className="cursor-pointer"
                      onClick={() => setActivePostId(post._id)}
                    />
                    <span>Reply</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CENTER CONTENT */}
          <div className="lg:col-span-6 space-y-6">
            {/* New Post Box */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                {user?.profilePic ? (
                  <img
                    src={user?.profilePic}
                    alt="user"
                    className="rounded-full w-12 h-12"
                  />
                ) : (
                  <Avatar
                    className="rounded-full text-black"
                    size="48"
                    color="#38AEE3"
                    name={user.name?.split(" ").slice(0, 2).join(" ")}
                  />
                )}

                <div className="flex-1">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Write your post..."
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-lg focus:outline-none resize-none"
                    rows={4}
                  />

                  {postContent.trim() && (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                        <label className="flex items-center gap-2 text-gray-600 text-base">
                          <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="w-5 h-5"
                          />
                          Post Anonymously
                        </label>

                        <select
                          value={selectedTopic}
                          onChange={(e) => setSelectedTopic(e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-2 text-base w-full sm:w-auto"
                        >
                          <option value="">Select Topic</option>
                          {Array.isArray(communities) &&
                            communities
                              .flatMap((comm) =>
                                Array.isArray(comm.topics) ? comm.topics : []
                              )
                              .slice(0, 5)
                              .map((topic) => (
                                <p
                                  key={topic._id}
                                  className="text-gray-700 border-b py-3 last:border-b-0"
                                >
                                  {topic.name}
                                  <span className="block text-sm text-gray-400">
                                    Community Topic
                                  </span>
                                </p>
                              ))}
                        </select>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mt-4">
                        <button
                          onClick={handleCreatePost}
                          className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition"
                        >
                          Post
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Replies */}
            {activePost && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col min-h-[400px]">
                <div className="flex gap-4 overflow-auto">
                  <div className="overflow-y-auto pr-2 max-h-[800px] w-full">
                    {activePost.comments?.map((reply) => (
                      <div key={reply._id} className="border-b last:border-b-0">
                        <div className="flex gap-4 p-6 border-b last:border-b-0">
                          <img
                            src={`https://i.pravatar.cc/100?u=${reply.user}`}
                            alt="user"
                            className="rounded-full w-12 h-12 flex-shrink-0"
                          />
                          <div>
                            <h2 className="text-2xl font-bold mb-2">User</h2>
                            <p className="text-gray-700">{reply.comment}</p>
                            <div className="text-sm text-gray-500 mt-4">
                              Posted on:{" "}
                              {new Date(reply.createdAt).toLocaleString()}
                            </div>
                            <div className="flex gap-6 mt-4 text-gray-600 text-lg">
                              <div className="flex gap-2">
                                <img
                                  src={Like}
                                  alt="like"
                                  onClick={() => handleCommentLike(reply._id)}
                                  className="cursor-pointer"
                                />
                                <span>{reply.likes?.length || 0}</span>
                              </div>
                              <div className="flex gap-2">
                                <img
                                  src={Dislike}
                                  alt="dislike"
                                  onClick={() =>
                                    handleCommentDislike(reply._id)
                                  }
                                  className="cursor-pointer"
                                />
                                <span>{reply.dislikes?.length || 0}</span>
                              </div>
                              <div className="flex gap-2">
                                <img
                                  src={Reply}
                                  alt="reply"
                                  onClick={() => {
                                    setReplyToCommentId(reply._id);
                                    setQuotedText(reply.comment);
                                    setIsReplyModalOpen(true);
                                  }}
                                  className="cursor-pointer"
                                />

                                <span className="cursor-pointer">Reply</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {reply.replies?.map((nested) => (
                          <>
                            <div
                              key={nested._id}
                              className="flex gap-4 border-b last:border-b-0 p-6"
                            >
                              <img
                                src={`https://i.pravatar.cc/100?u=${nested.user}`}
                                alt="user"
                                className="rounded-full w-12 h-12 flex-shrink-0"
                              />
                              <div>
                                <h2 className="text-2xl font-bold mb-2">
                                  User
                                </h2>
                                <p className="rounded-2xl border border-gray-200 p-4 mb-4">
                                  <span className="text-gray-400 text-lg">
                                    Replying to:
                                  </span>
                                  <br />"{reply.comment}"
                                </p>
                                <p>{nested.comment}</p>
                                <div className="text-sm text-gray-500 mt-4">
                                  Posted on:{" "}
                                  {new Date(nested.createdAt).toLocaleString()}
                                </div>
                                <div className="flex gap-6 mt-4 text-gray-600 text-lg">
                                  <div className="flex gap-2">
                                    <img
                                      src={Like}
                                      alt="like"
                                      onClick={() =>
                                        handleReplyLike(reply._id, nested._id)
                                      }
                                      className="cursor-pointer"
                                    />
                                    <span>{nested.likes?.length || 0}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <img
                                      src={Dislike}
                                      alt="dislike"
                                      onClick={() =>
                                        handleReplyDislike(
                                          reply._id,
                                          nested._id
                                        )
                                      }
                                      className="cursor-pointer"
                                    />
                                    <span>{nested.dislikes?.length || 0}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <img
                                      src={Reply}
                                      alt="reply"
                                      onClick={() => {
                                        setReplyToCommentId(reply._id); // this must be set
                                        setQuotedText(reply.comment); // optional — for showing quote
                                        setIsReplyModalOpen(true); // open the modal
                                      }}
                                    />

                                    <span className="cursor-pointer">
                                      Reply
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Reply Input */}
                <div className="mt-auto pt-4 border-t">
                  <div className="flex gap-4">
                    {user?.profilePic ? (
                      <img
                        src={user?.profilePic}
                        alt="user"
                        className="rounded-full w-12 h-12"
                      />
                    ) : (
                      <Avatar
                        className="rounded-full text-black"
                        size="32"
                        color={"#38AEE3"}
                        name={user.name
                          ?.split(" ") // Split by space
                          .slice(0, 2) // Take first 1–2 words
                          .join(" ")}
                      />
                    )}
                    <div className="w-full">
                      <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                      <textarea
                        placeholder={`Reply to ${activePost.description}`}
                        className="w-full border border-gray-300 rounded-2xl p-3 text-[18px] focus:outline-none min-h-32 placeholder-gray-400"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handlePostReply}
                      className="rounded-full text-white bg-[#38AEE3] flex items-center justify-center px-6 py-3"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Suggested Topics</h2>
              {Array.isArray(communities) &&
                communities
                  .flatMap((comm) => comm.topics || [])
                  .slice(0, 5)
                  .map((topic) => (
                    <p
                      key={topic._id}
                      className="text-gray-700 border-b py-3 last:border-b-0"
                    >
                      {topic.name}
                      <span className="block text-sm text-gray-400">
                        Community Topic
                      </span>
                    </p>
                  ))}
            </div>
            {/* <div className="bg-white border border-gray-200 rounded-2xl p-6">
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
            </div> */}
          </div>
        </div>
      )}
      <Transition.Root show={isReplyModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsReplyModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-2xl font-bold mb-4">
                    Reply to Comment
                  </Dialog.Title>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full border border-gray-300 rounded-2xl p-4 min-h-32 text-lg focus:outline-none"
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handlePostCommentReply}
                      className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full"
                    >
                      Post Reply
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default PaginationComm;
