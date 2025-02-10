import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import bcrypt from "bcryptjs";

export async function POST(req:NextRequest) {
  try {
    const body = await req.json(); // Parse request body
    const { username, email, password } = body;

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.users.create({
      data: { username, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
