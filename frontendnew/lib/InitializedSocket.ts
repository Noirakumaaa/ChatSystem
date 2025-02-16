import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(`http://192.168.16.107:3000`);
  }
  return socket;
};