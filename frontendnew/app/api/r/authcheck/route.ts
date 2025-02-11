import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){
    const token = await req.cookies.get("auth")

    if(!token){
        return NextResponse.json({Authenticated : false})
    }

    return NextResponse.json({ Authenticated : true})
}