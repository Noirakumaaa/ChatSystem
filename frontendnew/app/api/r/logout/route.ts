import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prismaClient";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const user = cookieStore.get("user");

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    await prisma.users.update({
        where: { id: user.value },
        data: { status: "Offline" },
    });

    cookieStore.delete("user");
    cookieStore.delete("auth");

    return NextResponse.json({ data: "Logout" });
}
