import express from 'express'
import Blogs from '../Schema/blogs.js' // Assuming you have the blog schema
import { authMiddleware } from '../Services/utils/middlewareAuth.js'
import { upload } from '../Services/utils/uploadMiddleware.js'
import {
  createLocalUrlForFile,
  createPublicUrlForFile
} from '../Services/utils/upload.js'
import User from '../Schema/user.js'
import fs from 'fs'
import { sendEmail } from '../Services/email/email.js'

const router = express.Router()

router.patch("/publish/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.type !== "Admin") {
      return res.status(403).json({ message: "Access denied." });
    }
    const { id: blogId } = req.params;

    const blog = await Blogs.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const publishedBlog = await Blogs.findByIdAndUpdate(blogId, { isDraft: !blog.isDraft }, {
      new: true, // returns the updated document
      runValidators: true, // optional: re-validate schema)
    })
    // Create the blog post
    if (!publishedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (publishedBlog.isDraft) {
      res.status(200).json({
        blog: publishedBlog,
        message: `Your Blog titled ${publishedBlog.title} is Published successfully 🎉!!`,
      });
    }
    else {
      res.status(200).json({
        blog: publishedBlog,
        message: `Your Blog titled "${publishedBlog.title}" is Unpublished`,
      });
    }
  } catch (err) {
    console.error("🔥 Error creating blog:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/edit", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.type !== "Admin") {
      return res.status(403).json({ message: "Access denied." });
    }
    const { _id, title, excerpt, content, category, featuredImage , isDraft} = req.body;

    const blog = await Blogs.findById(_id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const editedBlog = await Blogs.findByIdAndUpdate(_id, {
      title, excerpt, content, category, featuredImage, isDraft
    }, {
      new: true, // returns the updated document
      runValidators: true, // optional: re-validate schema)
    })
    // Create the blog post
    if (!editedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      blog: editedBlog,
      message: `Your Blog titled "${editedBlog.title}" is edited successfully 🎉!!`,
    });

  } catch (err) {
    console.error("🔥 Error creating blog:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



router.post("/create", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.type !== "Admin") {
      return res.status(403).json({ message: "Access denied." });
    }
    const { title, excerpt, content, category, featuredImage } = req.body;

    // Validation
    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Create the blog post
    const newBlog = new Blogs({
      title,
      excerpt,
      content,
      category,
      isDraft: true,
      featuredImage,
    });

    await newBlog.save();

    await notifyUsersAboutNewBlog(title, category);

    return res.status(201).json({
      message: "Blog post created successfully",
      blog: newBlog,
    });
  } catch (err) {
    console.error("🔥 Error creating blog:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-blogs", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.type !== "Admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    // Fetch all blogs, sorted by creation date (newest first)
    const blogs = await Blogs.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (err) {
    console.error("🔥 Error fetching blogs:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



// router.post(
//   '/',
//   authMiddleware,
//   upload.array('images', 10),
//   async (req, res) => {
//     const id = req.userId

//     try {
//       // Fetch user by ID
//       const user = await User.findById(id)
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' })
//       }

//       // Check if the user is an admin
//       if (user.type !== 'Admin') {
//         return res
//           .status(403)
//           .json({ message: 'Access denied. Only Admins can create blogs.' })
//       }

//       const { name, category, description } = req.body

//       // Validate required fields
//       if (!name || !category || !description) {
//         return res
//           .status(400)
//           .json({ message: 'Name, category, and description are required' })
//       }

//       const imageUrls = []

//       // Handle image uploads
//       if (req.files && req.files.length > 0) {
//         req.files.forEach(file => {
//           const filePath = createPublicUrlForFile(req, file) // Generate public URL for the file
//           imageUrls.push(filePath) // Add file path to images array
//         })
//       }

//       // Create new blog
//       const blog = new Blogs({
//         name,
//         category,
//         description,
//         images: imageUrls,
//         createdAt: new Date()
//       })

//       // Save blog to database
//       await blog.save()

//       await notifyUsersAboutNewBlog(name, category)

//       return res
//         .status(201)
//         .json({ message: 'Blog created successfully', blog })
//     } catch (error) {
//       return res.status(500).json({ message: error.message })
//     }
//   }
// )


async function notifyUsersAboutNewBlog(blogName, blogCategory) {
  try {
    // Fetch all users who are not Admins and have opted into email notifications
    const users = await User.find({
      type: { $ne: 'Admin' }, // Exclude Admin users
      'notifications.email.tipsAndTricks': true // Only users who opted in
    })

    for (const user of users) {
      // Determine the correct link based on user type
      let blogLink = 'https://famylink.us/blogs' // Default link
      if (user.type === 'Nanny') {
        blogLink = 'https://famylink.us/nanny/tipsAndArticles'
      } else if (user.type === 'Parents') {
        blogLink = 'https://famylink.us/family/tipsAndArticles'
      }

      sendEmail(
        user.email,
        `🆕 New Blog Post in ${blogCategory}!`,
        `<div style="padding: 12px">
          <h2 style="color: #14558F;">New Blog: ${blogName}</h2>
          <p>A new blog has been posted in the <strong>${blogCategory}</strong> category. 🎉</p>
          <p>Check it out now and stay updated with the latest tips and tricks!</p>
          <br>
          <a href="${blogLink}" style="padding: 10px 15px; background: #F98300; color: white; text-decoration: none; border-radius: 5px;">Read Blog</a>
          <br><br>
          <p style="font-size: 14px; color: #555;">
            Need help? Contact us at <a href="mailto:info@famylink.us">info@famylink.us</a>
          </p>
        </div>`
      )
    }
  } catch (error) {
    console.error('Error sending blog notification emails:', error)
  }
}



router.delete('/:id', authMiddleware, async (req, res) => {
  const userId = req.userId
  const { id: blogId } = req.params

  try {
    // Fetch user by ID
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if the user is an admin
    if (user.type !== 'Admin') {
      return res
        .status(403)
        .json({ message: 'Access denied. Only Admins can delete blogs.' })
    }

    // Find the blog by ID
    const blog = await Blogs.findById(blogId)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    // // Check if images are used by other blogs
    // if (Array.isArray(blog.images) && blog.images.length > 0) {
    //   for (const imageUrl of blog.images) {
    //     const isImageUsedElsewhere = await Blogs.findOne({
    //       _id: { $ne: blogId }, // Exclude the current blog
    //       images: imageUrl
    //     })

    //     if (!isImageUsedElsewhere) {
    //       // Convert the image URL to a local file path
    //       const localFilePath = createLocalUrlForFile(imageUrl)

    //       // If the file exists, delete it
    //       if (fs.existsSync(localFilePath)) {
    //         fs.unlinkSync(localFilePath)
    //       }
    //     }
    //   }
    // }

    // Delete the blog
    await blog.deleteOne()

    return res
      .status(200)
      .json({ blog: blog, message: `The blog titled "${blog.title}" is deleted successfully` })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.put('/:id', authMiddleware, upload.array('images', 10), async (req, res) => {
  const userId = req.userId;
  const { id: blogId } = req.params;
  const { name, category, description, images } = req.body;

  try {
    // Fetch user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is an admin
    if (user.type !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Only Admins can edit blogs.' });
    }

    // Find the blog by ID
    const blog = await Blogs.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Ensure at least one image is available (either from the existing blog or the request)
    if (!req.files || req.files.length === 0) {
      if (!blog.images || blog.images.length === 0) {
        return res.status(400).json({ message: 'At least one image is required.' });
      }
    }

    // Process images: check if 'images' in body is an array or string (for URLs)
    const providedImages = Array.isArray(images) ? images : images ? [images] : [];

    // Prepare new images list
    const updatedImages = [];

    // Add provided images that are already part of the blog
    blog.images.forEach((existingImage) => {
      if (providedImages.includes(existingImage)) {
        updatedImages.push(existingImage);
      }
    });

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const filePath = createPublicUrlForFile(req, file);
        updatedImages.push(filePath); // Add newly uploaded image paths
      });
    }

    // Ensure there is at least one image after processing
    if (updatedImages.length === 0) {
      return res.status(400).json({ message: 'At least one image must be provided or retained.' });
    }

    // Find images to delete
    const imagesToDelete = blog.images.filter(
      (existingImage) => !updatedImages.includes(existingImage)
    );

    // Delete unused images
    for (const imageUrl of imagesToDelete) {
      const isImageUsedElsewhere = await Blogs.findOne({
        _id: { $ne: blogId }, // Exclude the current blog
        images: imageUrl,
      });

      if (!isImageUsedElsewhere) {
        const localFilePath = createLocalUrlForFile(imageUrl);

        // If the file exists, delete it
        if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
        }
      }
    }

    // Update the blog's images
    blog.images = updatedImages;

    // Update other fields
    if (name !== undefined) blog.name = name;
    if (category !== undefined) blog.category = category;
    if (description !== undefined) blog.description = description;
    blog.createdAt = new Date()

    // Save the updated blog
    await blog.save();

    return res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});


router.get('', async (req, res) => {
  try {
    const { category, limit, page } = req.query;
    // Default pagination values
    const pageSize = parseInt(limit) || 10; // Number of blogs per page
    const currentPage = parseInt(page) || 1; // Current page
    const skip = (currentPage - 1) * pageSize; // Calculate items to skip

    // Build the query filter
    const filter = {};
    if (category) {
      filter.category = category; // Filter by category if provided
    }

    // Fetch blogs with pagination and filter
    const blogs = await Blogs.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ _id: -1 })  // Exclude internal Mongoose fields like `__v`

    // Fetch total count of blogs for pagination metadata
    const totalCount = await Blogs.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      status: 200,
      data: blogs,
      pagination: {
        totalRecords: totalCount,
        totalPages,
        currentPage,
        limit: pageSize,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: err.message,
    });
  }
});

// GET /blog/category/:category
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const blogs = await Blogs.find({ category });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch blog by ID
    const blog = await Blogs.findById(id);

    if (!blog) {
      return res.status(404).send({
        status: 404,
        message: 'Blog not found',
      });
    }

    // Fetch blogs with the same category, excluding the current one
    const relatedBlogs = await Blogs.find({
      category: blog.category,
      _id: { $ne: blog._id }, // Exclude the current blog
    });

    return res.status(200).send({
      status: 200,
      message: 'Blog fetched successfully',
      data: {
        blog,
        relatedBlogs,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 500,
      message: 'An error occurred while fetching the blog',
      error: error.message,
    });
  }
});

export default router
