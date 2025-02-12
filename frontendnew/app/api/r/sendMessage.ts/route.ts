import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prismaClient";
import { time } from "console";

export async function POST(req: NextRequest) {
    try {
        const { sender, receiver , message } = await req.json();

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
          
            const NewMessage = await prisma.messages.create({
                data : {
                    conversationID : createNewConversation.id,
                    sender : sender,
                    receiver : receiver,
                    message : message,
                    time : new Date(),
                    status : "Delivered"

                }
            })

         return NextResponse.json({message : "Message sent", data : NewMessage}, {status : 200})
        }


        const NewMessagee = await prisma.messages.create({
            data : {
                conversationID : findConversation.id,
                receiver : receiver,
                sender : sender,
                message : message,
                time : new Date(),
                status : "Delivered"
            }
        })



        return NextResponse.json({message : "Message sent", data : NewMessagee}, {status : 200})
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
