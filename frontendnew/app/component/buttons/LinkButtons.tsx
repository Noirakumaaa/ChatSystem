"use client";
import { useRouter } from "next/navigation";

export function HomeButton() {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.push("/")} 
      className="text-sm sm:text-base md:text-lg w-full sm:w-auto"
    >
      Home
    </button>
  );
}

export function AboutButton() {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.push("/about")} 
      className="text-sm sm:text-base md:text-lg w-full sm:w-auto"
    >
      About
    </button>
  );
}

export function ContactButton() {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.push("/contact")} 
      className="text-sm sm:text-base md:text-lg w-full sm:w-auto"
    >
      Contact
    </button>
  );
}

export function LoginButton() {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.push("/login")} 
      className="btn btn-primary text-sm sm:text-base md:text-lg w-full sm:w-auto"
    >
      Login
    </button>
  );
}

export function RegisterButton() {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.push("/register")} 
      className="btn btn-primary text-sm sm:text-base md:text-lg w-full sm:w-auto"
    >
      Register
    </button>
  );
}

export function GetStartedButton() {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.push("/register")} 
      className="btn btn-primary text-sm sm:text-base md:text-lg w-full sm:w-auto"
    >
      Get Started
    </button>
  );
}
