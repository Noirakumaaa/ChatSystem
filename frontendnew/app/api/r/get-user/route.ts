import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
    const currentUser = await req.json()
    //console.log(currentUser)
    const user = await prisma.users.findUnique({
        where : {
            id : currentUser.id
        }})
    
        return NextResponse.json({User : user})
}