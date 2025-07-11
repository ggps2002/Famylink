import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Drawer } from "antd";

const dummyBlogs = [
  {
    id: 1,
    title: "10 Tips for Better Parenting",
    content: `Parenting can be both rewarding and challenging. Here are 10 practical tips to strengthen your bond with your child...`,
  },
  {
    id: 2,
    title: "Introducing Nutrition to Toddlers",
    content: `Start with small, balanced meals. Avoid force-feeding and make food fun with colors and textures...`,
  },
  {
    id: 3,
    title: "Managing Screen Time",
    content: `Limit screen time based on age. Use parental controls and encourage outdoor play...`,
  },
  {
    id: 4,
    title: "Work-Life Balance for Parents",
    content: `Prioritize tasks, set boundaries, and make time for self-care...`,
  },
  {
    id: 5,
    title: "Building Routines",
    content: `Kids thrive on structure. A simple bedtime and mealtime schedule helps regulate behavior...`,
  },
   {
    id: 5,
    title: "Building Routines",
    content: `Kids thrive on structure. A simple bedtime and mealtime schedule helps regulate behavior...`,
  },
     {
    id: 5,
    title: "Building Routines",
    content: `Kids thrive on structure. A simple bedtime and mealtime schedule helps regulate behavior...`,
  },
     {
    id: 5,
    title: "Building Routines",
    content: `Kids thrive on structure. A simple bedtime and mealtime schedule helps regulate behavior...`,
  },
     {
    id: 5,
    title: "Building Routines",
    content: `Kids thrive on structure. A simple bedtime and mealtime schedule helps regulate behavior...`,
  },
     {
    id: 5,
    title: "Building Routines",
    content: `Kids thrive on structure. A simple bedtime and mealtime schedule helps regulate behavior...`,
  },
     {
    id: 5,
    title: "Building Routines",
    content: `Kids thrive on structure. A simple bedtime and mealtime schedule helps regulate behavior...`,
  },
     {
    id: 5,
    title: "Building Routines",
    content: `Kids thrive on structure. A simple bedtime and mealtime schedule helps regulate behavior...`,
  },
     {
    id: 5,
    title: "Building Routines",
    content: `Kids thrive on structure. A simple bedtime and mealtime schedule helps regulate behavior...`,
  },
     {
    id: 5,
    title: "Building Routines",
    content: `Kids thrive on structure. A simple bedtime and mealtime schedule helps regulate behavior...`,
  },
  
    {
    id: 5,
    title: "Building Routines",
    content: `Kids thrive on structure. A simple bedtime and mealtime schedule helps regulate behavior...`,
  },
  
    {
    id: 5,
    title: "Building Routines",
    content: `Kids thrive on structure. A simple bedtime and mealtime schedule helps regulate behavior...`,
  },
  
    {
    id: 5,
    title: "Building Routines",
    content: `Kids thrive on structure. A simple bedtime and mealtime schedule helps regulate behavior...`,
  },
  

];

export default function Blogs() {
  const [selectedBlog, setSelectedBlog] = useState(dummyBlogs[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Topbar with Hamburger on Mobile */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-semibold">Blogs</h1>
        <Menu onClick={() => setDrawerOpen(true)} className="cursor-pointer" />
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:block w-1/4 lg:w-1/5 border-r bg-white p-4 overflow-y-auto max-h-screen">
        <h2 className="text-lg font-bold mb-4">All Blogs</h2>
        <ul className="space-y-2">
          {dummyBlogs.map((blog) => (
            <li
              key={blog.id}
              onClick={() => setSelectedBlog(blog)}
              className={`cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100 transition ${
                selectedBlog.id === blog.id ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              {blog.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Drawer (Mobile) */}
      <Drawer
        title="All Blogs"
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={250}
      >
        <ul className="space-y-2">
          {dummyBlogs.map((blog) => (
            <li
              key={blog.id}
              onClick={() => {
                setSelectedBlog(blog);
                setDrawerOpen(false);
              }}
              className={`cursor-pointer px-2 py-2 rounded hover:bg-gray-100 transition ${
                selectedBlog.id === blog.id ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              {blog.title}
            </li>
          ))}
        </ul>
      </Drawer>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{selectedBlog.title}</h1>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {selectedBlog.content}
          </p>
        </div>
      </main>
    </div>
  );
}
