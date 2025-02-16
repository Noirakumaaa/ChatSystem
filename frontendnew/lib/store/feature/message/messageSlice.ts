import { createSlice,PayloadAction  } from '@reduxjs/toolkit';
import { fetchMessages } from './messageThunks';



interface Message {
    id: string;
    sender: string;
    receiver: string;
    time: string;
    message: string;
    status: string;
  }

interface MessageState {
  messages: Message[];
  message : Message;
  loading: boolean;
}

const initialState: MessageState = { 
  messages : [],
  message : {
    id: "",
    sender: "",
    receiver: "",
    time: "",
    message: "",
    status: "",
  },
  loading: false };

const messageState = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => { state.loading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state) => { state.loading = false; });
  },
});

export const { } = messageState.actions;
export default messageState.reducer;
