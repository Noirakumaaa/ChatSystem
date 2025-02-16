// import { Middleware } from "@reduxjs/toolkit";
// import { io, Socket } from "socket.io-client";
// import { AppDispatch } from "../index";
// import { fetchUsers } from "../feature/users/userThunks";

// let socket: Socket | null = null;

// export const socketMiddleware: Middleware = (store) => (next) => (action : any) => {
//   if (action.type === "socket/connect") {
//     if (!socket) {
//       socket = io(`http://${process.env.NEXT_PUBLIC_HOST_NAME}:${process.env.NEXT_PUBLIC_PORT}`); 

//       socket.on("userUpdate", (data) => {
//         store.dispatch<AppDispatch(fetchUsers()); 
//       });

//       socket.on("disconnect", () => {
//         console.log("Socket disconnected");
//       });
//     }
//   }

//   if (action.type === "socket/disconnect") {
//     if (socket) {
//       socket.disconnect();
//       socket = null;
//     }
//   }

//   return next(action);
// };
