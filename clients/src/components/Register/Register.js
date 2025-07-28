import axios from 'axios'
import React, { useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

function Register () {
  const [username , setUsername] = useState('')
  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [error, setErrors] = useState([]);
  const navigate = useNavigate()

  const handlerRegister = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`http://localhost:3000/api/auth/register`,{
        username,
        email,
        password
      })
      localStorage.setItem('token', response.data.token)
       Swal.fire({
              icon: 'success',
              title: 'Login Successful!',
              showConfirmButton: false,
              timer: 1500,
            });
          navigate('/DashboardUser')
    } catch (error) {
      let errorMessages = [];

    if (error.response?.data?.errors) {
      // Expected format from backend
      errorMessages = error.response.data.errors;
    } else if (typeof error.response?.data === 'string') {
      // Backend returned a plain string
      errorMessages = [{ msg: error.response.data }];
    } else {
      // Fallback error
      errorMessages = [{ msg: error.message || 'Registration failed' }];
    }

    setErrors(errorMessages);

    Swal.fire({
      icon: 'error',
      title: 'Registration Failed',
      html: errorMessages.map((e) => `<p>${e.msg}</p>`).join(''),
          customClass: {
         confirmButton: 'my-swal-btn'
  }
    });
    }
  }

    return(
        <>
<div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>
    <form>
      <div class="mb-4">
        <label class="block text-gray-600 mb-2" for="username">Username</label>
        <input
          id="username"
          type="text"
           value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-600 mb-2" for="email">Email</label>
        <input
          id="email"
           value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email"
          class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-600 mb-2" for="password">Password</label>
        <input
          id="password"
          type="password"
           value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
        onClick={handlerRegister}
      >
        Register
      </button>
      <p class="text-sm text-center mt-4 text-gray-600">
        Already have an account?
        <Link to="/login" class="text-blue-500 hover:underline">Login</Link>
      </p>
    </form>
  </div>
</div>


        </>
    )
}

export default Register