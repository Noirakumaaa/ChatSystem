"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Correct Next.js navigation
import Topnav from "../component/Topnav";

const Login = () => {
  const router = useRouter(); // ✅ Use Next.js router

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Login successful:", data);
      router.push("/a/home");
    } else {
      console.error("Login failed:", data);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col overflow-y-auto">
      <Topnav />
      <div className="mt-16 flex justify-center items-center p-4">
        <div className="border border-black w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] min-h-[30%] p-6 bg-gray-100">
          {/* Header Section */}
          <h2 className="text-xl font-bold text-center mb-4">Login</h2>

          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <label className="input input-bordered flex items-center gap-2">
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="grow"
                placeholder="daisy@site.com"
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="grow"
                placeholder="********"
                required
              />
            </label>
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
