import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prismaClient";
import Conversations from "@/app/component/Conversations";

export async function POST(req: NextRequest) {
    try {
        const { sender, receiver } = await req.json();

        const findConversation = await prisma.conversation.findFirst({
            where: {
                participants: {
                    hasEvery: [sender, receiver] 
                }
            }
        });

        if(!findConversation){
            const createNewConversation = await prisma.conversation.create({
                data : {
                    participants : [sender , receiver],
                    lastMessage : ""
                }
            })
            return NextResponse.json({Conversations : createNewConversation, message : "New Conversation"}, {status : 200})
        }


        const getMessages = await prisma.messages.findMany({
            where : {
                conversationID : findConversation.id,
            }
        })

        return NextResponse.json({ conversation: getMessages }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
