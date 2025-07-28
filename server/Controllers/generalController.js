const TablePost = require('../Database/post.js')
const TableComment = require('../Database/comment')
const User = require('../Database/user.js')
//create post function 
exports.CreatePost = async (req, res, next) => {
  const userId = req.user.userId;
   const image = req.file ? req.file.filename : null;
  const { content } = req.body;

  try {
    const NewPost = new TablePost({
      author: userId, 
      content,
      image,
    });

    await NewPost.save();
    return res.status(200).json({ message: 'The new post was created successfully' });
  } catch (error) {
    next(error);
  }
};


//function for show all post in dashboard user
exports.DashboardUser = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    const fetchPosts = await TablePost.find({ author: userId });
    return res.status(200).json({ message: "All posts fetched", fetchPosts });
  } catch (error) {
    next(error);
  }
};

//function for display all the post in dahsborad all user
exports.DashboardAllUser = async (req, res, next) => {
  try {
    const fetchAllThePosts = await TablePost.find().sort({ createdAt: -1 }).populate('author', 'username profileImage');;
    return res.status(200).json({ message: 'All posts fetched', fetchAllThePosts });
  } catch (error) {
    next(error);
  }
};

//edit function (post)
exports.EditPost = async (req, res, next) => {
  const userId = req.user.userId;
  const postId = req.params.postId; 
  const { content } = req.body;

  try {
    // Update only if the author matches userId to prevent unauthorized edits
    const editPost = await TablePost.findOneAndUpdate(
      { _id: postId, author: userId },
      { content },
      { new: true }
    );

    if (!editPost) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    return res.status(200).json({ message: 'The post was edited successfully', editPost });
  } catch (error) {
    next(error);
  }
};

//delete function (post)
exports.DeletePost = async (req, res, next) => {
  const userId = req.user.userId;
  const postId = req.params.postId; // usually postId from params

  try {
    const deletedPost = await TablePost.findOneAndDelete({ _id: postId, author: userId });

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    return res.status(200).json({ message: 'The post was deleted successfully' });
  } catch (error) {
    next(error);
  }
};
//show all commnet for each post 
exports.ShowComment = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const comments = await TableComment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate('author', 'username profileImage'); // Important!

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
};
exports.likePost = async (req, res) => {
  const userId = req.user.userId;
  const postId = req.params.postId;

  try {
    const post = await TablePost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check if user already liked
    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: 'You already liked this post.' });
    }

    // Add user to likes array
    post.likes.push(userId);
    await post.save();

    return res.status(200).json({ message: 'Post liked successfully.' });
  } catch (error) {
    console.error('Like error:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};
exports.createComment = async (req, res) => {
  const author = req.user.userId;
  const postId = req.params.postId;
  const { text } = req.body;
  try {
    // Validate input
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment cannot be empty.' });
    }

    // Find the post
    const post = await TablePost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Create the comment
    const newComment = await TableComment.create({
      text,
      post: postId,
      author, // ✅ use 'author' to match the schema
    });

    // Optionally, push comment ID to post's comments array
    post.comments.push(newComment._id);
    await post.save();
    
    return res.status(201).json({
      message: 'Comment added successfully.',
      text : newComment,
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};
// GET /api/profile
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const postsCount = await TablePost.countDocuments({ author: userId });
    const followersCount = await User.countDocuments({ followed: userId });

    res.json({
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      location: user.location || 'Not set',
      role: user.role || 'User',
      postsCount,
      followersCount,
    });
  } catch (err) {
    console.error('Error in getUserProfile:', err); 
  res.status(500).json({ error: 'Something went wrong' });
  }
};
exports.followUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const userId = req.params.userId; // 🔥 This is the target user

    if (followerId === userId) {
      return res.status(400).json({ error: "You can't follow yourself." });
    }

    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(followerId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (currentUser.following.includes(userId)) {
      return res.status(400).json({ error: 'Already following this user.' });
    }

    currentUser.following.push(userId);
    userToFollow.followers.push(followerId);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: 'User followed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while following user.' });
  }
};


