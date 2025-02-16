import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prismaClient"; 
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
    const cookieStore = await cookies()
    try {
        const body = await req.json();
        const { email, password } = body;

        console.log(email, password);

        const findUser = await prisma.users.findUnique({
            where: { email: email }
        });

        if (!findUser) {
            return NextResponse.json({ Message: "User not found" }, { status: 404 });
        }

        const credentialsValid = await bcrypt.compare(password, findUser.password);

        if (!credentialsValid) {
            return NextResponse.json({ Message: "Invalid password" }, { status: 401 });
        }

        const token = jwt.sign(
            {
                username: findUser.username,
                email: findUser.email
            },
            process.env.JWT_TOKEN!, 
            { algorithm: "HS256", expiresIn: "7d" } 
        );

        
        cookieStore.set({
            name: "auth",
            value: token,
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        
        cookieStore.set({
            name: "user",
            value: findUser.id,
            httpOnly: false, 
            path: "/",
            maxAge: 60 * 60 * 24 * 7, 
        });

          return NextResponse.json({ Message: "LOGIN SUCCESSFULLY" }, { status: 200 });


    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ Message: "Internal Server Error" }, { status: 500 });
    }
}
