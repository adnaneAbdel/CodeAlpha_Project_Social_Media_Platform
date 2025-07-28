import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const DashboardForAll = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [likes, setLikes] = useState({});

  const fetchAllPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/Dashboard-All', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const postsData = response.data.fetchAllThePosts || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/comments/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((prev) => ({
        ...prev,
        [postId]: response.data.comments || [],
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

 const handleAddComment = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      `http://localhost:3000/api/comments/${postId}`,
      { text: newComment[postId] },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewComment((prev) => ({ ...prev, [postId]: '' }));

    // Refresh the comments after adding one
    fetchComments(postId);
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};


  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikes((prev) => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1,
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  useEffect(() => {
  const fetchPostsAndComments = async () => {
    await fetchAllPosts();
  };

  fetchPostsAndComments();
}, []);

  // useEffect(() => {
  //   fetchAllPosts();
  // }, []);
useEffect(() => {
  // Fetch comments for each post after posts are set
  posts.forEach((post) => {
    fetchComments(post._id);
  });
}, [posts]);
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-xl font-bold text-blue-600 mb-6">MiniSocial</h2>
        <ul className="space-y-4 text-gray-700 font-medium">
         <Link to="/DashboardUser"> <li className="hover:text-blue-500">🏠 Home</li></Link>
          <li className="hover:text-blue-500">👥 Friends</li>
          <li className="hover:text-blue-500">🔔 Notifications</li>
          <li className="hover:text-blue-500">💬 Messages</li>
          <li className="hover:text-blue-500">⚙️ Settings</li>
        </ul>
      </aside>

      {/* Feed */}
      <main className="flex-1 max-w-2xl mx-auto p-6 space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center mb-3 space-x-3">
                <img
                  src={
                    post.author?.profileImage ||
                    'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg'
                  }
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                 <Link to={`/profile/${post.author?._id}`}>{post.author?.username || 'Unknown'}</Link>
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{post.content}</p>

              {post.image && (
                <img
                  src={`http://localhost:3000/uploads/${post.image}`}
                  alt="post"
                  className="w-full h-80 object-cover rounded-xl mb-4"
                />
              )}

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="space-x-4">
                  <button
                    onClick={() => handleLike(post._id)}
                    className="hover:text-blue-600"
                  >
                    👍 Like
                  </button>
                  <button
                    onClick={() => fetchComments(post._id)}
                    className="hover:text-blue-600"
                  >
                    💬 Comment
                  </button>
                </div>
                <p>❤️ {post.likes?.length + (likes[post._id] || 0)}</p>
              </div>

              {/* Comment input */}
              <div className="mt-4">
                <input
                  type="text"
                  value={newComment[post._id] || ''}
                  onChange={(e) =>
                    setNewComment((prev) => ({
                      ...prev,
                      [post._id]: e.target.value,
                    }))
                  }
                  placeholder="Add a comment..."
                  className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => handleAddComment(post._id)}
                  className="mt-2 text-sm text-white bg-blue-500 px-4 py-1 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>

              {/* Render comments */}
              <div className="mt-4 space-y-2">
              {comments[post._id] &&
                comments[post._id].map((cmt) => (
                  <div
                    key={cmt._id}
                    className="mt-3 flex items-start space-x-3 bg-gray-50 rounded-lg p-3 shadow-sm"
                  >
                    <img
                      src={
                        cmt.author?.profileImage ||
                        'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg'
                      }
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800">{cmt.author?.username || 'Unknown'}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(cmt.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{cmt.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </main>

      {/* Right Panel */}
      <aside className="w-72 p-6 hidden lg:block">
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">About This Project</h3>
          <p className="text-sm text-gray-600">
            MiniSocial is a minimalist social media concept built by Adnane Abdellaoui.
            Built with 💙 using MERN.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect with me</h3>
          <a
            href="https://adnane-abdellaoui.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 hover:underline text-sm"
          >
            🌐 adnane-abdellaoui.netlify.app
          </a>
          <a
            href="https://www.linkedin.com/in/adnane-abdellaoui/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 hover:underline text-sm"
          >
            💼 adnane-abdellaoui
          </a>
          <a
            href="https://github.com/adnane-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 hover:underline text-sm"
          >
            🧑‍💻 github.com/adnaneAbdel
          </a>
        </div>
      </aside>
    </div>
  );
};

export default DashboardForAll;
