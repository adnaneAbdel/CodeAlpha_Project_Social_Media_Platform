import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const DashboardUser = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState([]);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));
  const userId = userData?.id;
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);

      await axios.post('http://localhost:3000/api/Create-Post', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Post created successfully!',
        showConfirmButton: false,
        timer: 1500,
      });

      setContent('');
      setImage(null);
      fetchPosts();
    } catch (error) {
      const errorMessages = error.response?.data?.errors
        ? error.response.data.errors
        : [{ msg: error.message || 'Something went wrong.' }];

      setErrors(errorMessages);

      Swal.fire({
        icon: 'error',
        title: 'Post Failed',
        html: errorMessages.map((e) => `<p>${e.msg}</p>`).join(''),
        customClass: {
          confirmButton: 'my-swal-btn',
        },
      });
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/Delete-Post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Post deleted successfully!',
        showConfirmButton: false,
        timer: 1500,
      });

      fetchPosts();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong.',
      });
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditImage(null); // start fresh
  };

  const handleUpdatePost = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('content', editContent);
      if (editImage) formData.append('image', editImage);

      await axios.put(
        `http://localhost:3000/api/Edit-Post/${editingPost._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Post updated successfully!',
        showConfirmButton: false,
        timer: 1500,
      });

      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Update failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to update post',
        text: error.response?.data?.message || 'Unexpected error occurred.',
      });
    }
  };

const fetchPosts = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/api/Dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Fetched posts:', response.data); // <-- log here

    // Try one of these based on output
    setPosts(response.data.fetchPosts);
    // setPosts(response.data.posts);

  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};


  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">MiniSocial</h1>
        <nav>
          <ul className="flex space-x-4 text-gray-700">
            <li><Link to="/DashboardForAll" className="hover:text-blue-500">Home</Link></li>
            <li><Link to={`/profile/${userId}`} className="hover:text-blue-500">Profile</Link></li>
            <li><Link to="/Login" className="hover:text-red-500">Logout</Link></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        {/* Post Creator */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Create a Post</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="3"
          />
          <div className="mt-4">
            <label className="block text-gray-600 mb-1">Add an Image (optional)</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="block w-full border border-gray-300 p-2 rounded-xl"
            />
          </div>
          <button
            onClick={handleCreatePost}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Post
          </button>
        </div>

        {/* Posts Table */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Posts</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="border px-4 py-2">Image</th>
                  <th className="border px-4 py-2">Author</th>
                  <th className="border px-4 py-2">Content</th>
                  <th className="border px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">
                      <img
                        src={`http://localhost:3000/uploads/${post.image}` || 'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg'}
                        alt="post"
                        className="w-10 h-10 rounded object-cover"
                      />
                    </td>
                    <td className="p-3 border-b">{post.authorName || 'You'}</td>
                    <td className="p-3 border-b">{post.content}</td>
                    <td className="p-3 border-b text-center space-x-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-500 py-6">
                      No posts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Edit Post</h2>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows="4"
            />
            <input
              type="file"
              onChange={(e) => setEditImage(e.target.files[0])}
              className="block w-full"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePost}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUser;
