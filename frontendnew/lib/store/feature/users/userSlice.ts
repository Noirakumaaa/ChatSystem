import { createSlice,PayloadAction  } from '@reduxjs/toolkit';
import { fetchUsers } from './userThunks';

interface user {
    email: string;
    id: string;
    password: string;
    socketId: string;
    username: string;
    status: string;
}
interface onlineUser {
  socketId : string;
  username : string;
  status : string;
}


interface UserState {
  allUsers: user[];
  onlineUsers : onlineUser[];
  currentUser : user;
  targetUser : user;
  loading: boolean;
}

const initialState: UserState = { 
  allUsers: [], 
  onlineUsers: [],
  currentUser: {
    email : "",
    id : "",
    password : "",
    socketId : "",
    username : "",
    status : ""
  }, 
  targetUser: {
    email : "",
    id : "",
    password : "",
    socketId : "",
    username : "",
    status : ""
  }, 
  loading: false };
  const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
      setTargetUser: (state, action: PayloadAction<string>) => {
        const targetId = action.payload;
        const user = state.allUsers.find((user) => user.id === targetId);
        if (user) {
          state.targetUser = user;
        }
      },
      updateOnlineUsers: (state, action: PayloadAction<onlineUser[]>) => {
        state.onlineUsers = action.payload; 
      },
      
      
      updateUser: (state, action: PayloadAction<user>) => {
        const updatedUser = action.payload;
        console.log(updatedUser)
        const index = state.allUsers.findIndex((user) => user.id === updatedUser.id);
        if (index !== -1) {
          state.allUsers[index] = updatedUser;
          if (state.currentUser.id === updatedUser.id) {
            state.currentUser = updatedUser;
          }
          if (state.targetUser.id === updatedUser.id) {
            state.targetUser = updatedUser;
          }
        }
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUsers.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
          state.allUsers = action.payload.Users;
          state.currentUser = action.payload.CurrentUser;
          state.loading = false;
        })
        .addCase(fetchUsers.rejected, (state) => {
          state.loading = false;
        });
    },
  });
  
  export const { setTargetUser, updateUser,updateOnlineUsers } = userSlice.actions;
  export default userSlice.reducer;
  