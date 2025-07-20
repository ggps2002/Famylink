import React, { useEffect, useState, useMemo } from "react";
import { Spin, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogByCategoryThunk } from "../Redux/blogsSlice";
import { Calendar } from "lucide-react";

const BLOGS_PER_PAGE = 5;

const renderPreview = (content) => {
  return content
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-3">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="w-full object-cover rounded-xl my-4" />'
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 underline">$1</a>'
    )
    .replace(/^- (.*$)/gm, '<ul class="list-disc ml-6 mb-4"><li>$1</li></ul>')
    .replace(
      /^\d+\. (.*$)/gm,
      '<ol class="list-decimal ml-6 mb-4"><li>$1</li></ol>'
    )
    .replace(/\n\n/g, '</p><p class="mb-4 text-lg">')
    .replace(/^(.*)$/gm, '<p class="mb-4 text-lg">$1</p>')
    .replace(/<\/p><p class="mb-4"><\/p>/g, '</p><p class="mb-4 text-lg">')
    .replace(/^<p class="mb-4 text-lg"><h/g, "<h")
    .replace(/h[1-3]><\/p>$/gm, (match) => match.replace(/<\/p>$/, ""));
};

export default function Blogs({ category = "Tips for Parents", searchQuery }) {
  const dispatch = useDispatch();
  const { blogsByCategory, isLoading } = useSelector((state) => state.blogs);
  const blogs = useMemo(() => {
    const all = blogsByCategory[category] || [];
    return all
      .filter((b) => !b.isDraft)
      .filter((b) =>
        searchQuery
          ? // eslint-disable-next-line react/prop-types
            b.title.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      );
  }, [blogsByCategory, category, searchQuery]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * BLOGS_PER_PAGE;
    return blogs.slice(start, start + BLOGS_PER_PAGE);
  }, [blogs, currentPage]);

  useEffect(() => {
    dispatch(fetchBlogByCategoryThunk(category));
  }, [category, dispatch]);

  useEffect(() => {
    setSelectedBlog(null);
    setCurrentPage(1);
  }, [category]);

  return (
    <div className="min-h-screen px-4 md:px-16 py-6">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Spin />
        </div>
      ) : selectedBlog ? (
        <div>
          <button
            onClick={() => setSelectedBlog(null)}
            className="mb-6 text-blue-600 font-medium text-xl"
          >
            ← Back to Blog List
          </button>
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {selectedBlog.title}
          </h1>
          {selectedBlog.excerpt && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 italic">
              {selectedBlog.excerpt}
            </p>
          )}
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: renderPreview(selectedBlog.content),
            }}
          />
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            {category}
          </h2>
          {paginatedBlogs.length === 0 ? (
            <p className="text-gray-500 text-xl">No blogs available yet.</p>
          ) : (
            <>
              <ul className="space-y-6">
                {paginatedBlogs.map((blog) => (
                  <li
                    key={blog._id}
                    onClick={() => setSelectedBlog(blog)}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-foreground text-lg">
                            {blog.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {blog.isDraft && blog.publishedAt
                              ? new Date(blog.publishedAt).toLocaleDateString()
                              : `Created ${new Date(
                                  blog.createdAt
                                ).toLocaleDateString()}`}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {blog.excerpt}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={BLOGS_PER_PAGE}
                  total={blogs.length}
                  onChange={(page) => setCurrentPage(page)}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
