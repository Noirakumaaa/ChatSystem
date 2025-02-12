import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function GET(req:NextRequest) {
    const cookieStore = await cookies()
    const cookieUser = cookieStore.get("user");

    const currentUser = await prisma.users.findUnique({
        where : {
            id : cookieUser?.value
        }
    })
    console.log("DATAAAAAAAAAA " ,currentUser)
    return NextResponse.json({CurrentUser : currentUser})
}