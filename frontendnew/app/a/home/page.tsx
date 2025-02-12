"use client";
import React, { useEffect } from "react";


const Home = () => {


  return (
    <div className="min-h-screen w-screen flex flex-col overflow-y-auto">
      <div className="mt-16 flex justify-center items-center p-4">
        <div className="border border-black w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] min-h-[30%] p-6 bg-gray-100">
          <h2 className="text-xl font-bold text-center mb-4">Welcome to Home</h2>
          <p className="text-center">You are now logged in!</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
