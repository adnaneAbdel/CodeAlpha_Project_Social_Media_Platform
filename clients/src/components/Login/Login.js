
import axios from 'axios'
import React, { useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

function Login () {
  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [error, setError] = useState([]);
  const navigate = useNavigate()
  const  handlerLogin = async (e) => {
     e.preventDefault();
   try {
     const response = await axios.post('http://localhost:3000/api/auth/login',{
      email ,
      password
      
    })
    localStorage.setItem('token',response.data.token)
     Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        showConfirmButton: false,
        timer: 1500,
      });
    navigate('/DashboardUser')
   } catch (error) {
     console.error('Login Error:', error);
      let errorMessages =
        error.response && error.response.data && error.response.data.errors
          ? error.response.data.errors
          : [{ msg: 'Invalid email or password' }];

      setError(errorMessages);

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
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
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
    <form >
      <div class="mb-4">
        <label class="block text-gray-600 mb-2" for="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          placeholder="Enter your password"
          class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
         onClick={handlerLogin}
        class="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
      >
        Login
      </button>
      <p class="text-sm text-center mt-4 text-gray-600">
        Don't have an account?
        <Link to="/register" class="text-blue-500 hover:underline">Register</Link>
      </p>
    </form>
  </div>
</div>

        </>
    )
}

export default Login