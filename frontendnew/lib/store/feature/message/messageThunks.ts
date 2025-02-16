import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store/index";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ currentUser, targetUser }: { currentUser: string; targetUser: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://192.168.16.107:3000/api/r/getConversation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: currentUser, receiver: targetUser }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      console.log("Message Data:", data);
      return data.conversation;
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
