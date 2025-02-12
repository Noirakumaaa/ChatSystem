"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Topnav from "../component/Topnav";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Registration successful:", data);
      router.push("/login");
    } else {
      console.error("Registration failed:", data);
    }
  };

  const handleLogin = ()=>{
    router.push("/login");
  }

  return (
    <div className="min-h-screen w-screen flex flex-col overflow-y-auto">
      <Topnav />
      <div className="mt-16 flex justify-center items-center p-4">
        <div className="border border-black w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] min-h-[30%] p-6 bg-gray-100">
          <h2 className="text-xl font-bold text-center mb-4">Register</h2>
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="font-semibold">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="daisy@site.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-semibold">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="********"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>
          </form>
          <div className="divider"></div>
          <button type="submit" className="btn btn-primary w-full" onClick={handleLogin}>
              Login
        </button>
        </div>

      </div>

    </div>
  );
};

export default Register;
