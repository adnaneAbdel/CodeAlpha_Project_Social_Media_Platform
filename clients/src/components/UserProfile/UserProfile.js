import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaUserFriends,
  FaRegCommentDots,
} from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { userId } = useParams(); 
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    console.log("Follow button clicked");

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token missing");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/api/follow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Follow response:", res.data);
      setIsFollowing(true); // toggle UI
        // ✅ Increment followers count locally
    setUser((prevUser) => ({
      ...prevUser,
      followersCount: (prevUser.followersCount || 0) + 1,
    }));
    } catch (err) {
      console.error('Follow error:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:3000/api/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);

        // Optionally check if already following (if backend supports it)
        // setIsFollowing(response.data.isFollowing); // if you return it in backend

      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (!user) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  return (
    <div className="bg-gray-100 py-10 px-4 flex justify-center">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">
        {/* Cover */}
        <div className="relative h-40 bg-gradient-to-r from-blue-500 to-blue-700">
          <div className="absolute -bottom-12 left-6">
            <img
              src={
                user.profileImage ||
                'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg'
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 px-6 pb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
              <p className="text-sm text-gray-500">{user.role || 'User'}</p>
            </div>
            <div className="flex space-x-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-600">{user.postsCount || 0}</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-600">{user.followersCount || 0}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-gray-700 text-sm mb-6">
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-blue-500" />
              {user.email}
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-500" />
              {user.location || 'Unknown location'}
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleFollow}
              disabled={isFollowing}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                isFollowing ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <FaUserFriends /> {isFollowing ? 'Following' : 'Follow'}
            </button>

            <button className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 transition">
              <FaRegCommentDots /> Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
