import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function GET(req:NextRequest) {
    const allUser = await prisma.users.findMany();

    return NextResponse.json({Users : allUser})
    
}