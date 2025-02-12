import React from "react";
import Link from 'next/link'


const Hero = () => {

  return (
    <>
      <div className="hero bg-base-200 min-h-[90%]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <Link className="btn btn-primary m-2" href="/login">Login</Link>
            <Link className="btn btn-primary m-2" href="/register">Register</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
