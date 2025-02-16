import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies(); 
    const cookieUser = cookieStore.get("user")?.value;

    if (!cookieUser) {
      console.log(cookieUser)
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const allUsers = await prisma.users.findMany();

    const currentUser = await prisma.users.findUnique({
      where: { id: cookieUser }, 
    });

    return NextResponse.json({ Users: allUsers, CurrentUser: currentUser });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
