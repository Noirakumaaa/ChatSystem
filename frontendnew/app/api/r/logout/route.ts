import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req:NextRequest) {
    const cookieStore = await cookies()
    cookieStore.delete("user")
    cookieStore.delete("auth")
    return NextResponse.json({data : "Logout"})
}