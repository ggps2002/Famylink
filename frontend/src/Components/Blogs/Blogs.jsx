import React, { useEffect, useState, useMemo } from "react";
import { Menu } from "lucide-react";
import { Drawer, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogByCategoryThunk } from "../Redux/blogsSlice";

const categories = [
  "Tips for Parents",
  "Tips For Nannies",
  "Platform Tips",
  "Special Needs Care",
  "Do It Yourself",
  "Nanny Activities",
  "News",
];

export default function Blogs({ category = "Tips for Parents" }) {
  const dispatch = useDispatch();
  const { blogsByCategory, isLoading } = useSelector((state) => state.blogs);
  const blogs = useMemo(
    () => blogsByCategory[category] || [],
    [blogsByCategory, category]
  );
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogByCategoryThunk(category));
  }, [category, dispatch]);

  useEffect(() => {
    if (blogs.length > 0) {
      setSelectedBlog(blogs[0]); // Set default blog for new category
    } else {
      setSelectedBlog(null); // If no blogs found in category
    }
  }, [blogs, category]); // <- Add `category` to deps

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Topbar for Mobile */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-semibold">Blogs</h1>
        <Menu onClick={() => setDrawerOpen(true)} className="cursor-pointer" />
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-1/4 lg:w-1/5 border-r p-4 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold mb-4">All Blogs</h2>
        <ul className="space-y-2">
          {blogs.map((blog) => (
            <li
              key={blog._id}
              onClick={() => setSelectedBlog(blog)}
              className={`cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100 transition ${
                selectedBlog?._id === blog._id
                  ? "bg-gray-100 font-semibold"
                  : ""
              }`}
            >
              {blog.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Drawer for Mobile */}
      <Drawer
        title="All Blogs"
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={250}
      >
        <ul className="space-y-2">
          {blogs.map((blog) => (
            <li
              key={blog._id}
              onClick={() => {
                setSelectedBlog(blog);
                setDrawerOpen(false);
              }}
              className={`cursor-pointer px-2 py-2 rounded hover:bg-gray-100 transition ${
                selectedBlog?._id === blog._id
                  ? "bg-gray-100 font-semibold"
                  : ""
              }`}
            >
              {blog.name}
            </li>
          ))}
        </ul>
      </Drawer>

      {/* Main Content */}
      <main className="p-6 md:p-10 overflow-y-auto">
        {isLoading ? (
          <Spin />
        ) : selectedBlog ? (
          <div className="mx-auto">
            <h1 className="text-4xl font-bold mb-4">{selectedBlog.name}</h1>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-xl">
              {selectedBlog.description}
            </p>
            {selectedBlog.images?.length > 0 && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedBlog.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Blog image ${idx + 1}`}
                    className="rounded-lg w-full h-auto"
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No blog selected.</p>
        )}
      </main>
    </div>
  );
}
