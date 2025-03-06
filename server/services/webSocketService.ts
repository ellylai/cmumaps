import { Server, Socket } from "socket.io";
import type {
  LiveUser,
  WebSocketPayloads,
} from "../../shared/webSocketTypes.ts";
import { WebSocketEvents } from "../../shared/webSocketTypes.ts";
export class WebSocketService {
  private io: Server;

  private socketMap: Map<string, Socket> = new Map();
  private socketToRoom: Map<string, string> = new Map();
  private socketToUser: Map<string, LiveUser> = new Map();

  constructor(io: Server) {
    this.io = io;
    // Socket.IO connection handling
    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.socketMap.set(socket.id, socket);
      this.socketToUser.set(socket.id, {
        userName: socket.handshake.query.userName as string,
        color: socket.handshake.query.userColor as string,
      });

      // Join a room
      socket.on("join", async (room) => {
        socket.join(room);
        this.socketToRoom.set(socket.id, room);
        console.log(`${socket.id} joined room: ${room}`);

        // sync users in room
        const users = await io.in(room).fetchSockets();
        const userMap: Record<string, LiveUser> = {};
        users.forEach((user) => {
          userMap[user.id] = this.socketToUser.get(user.id) as LiveUser;
        });
        const payload = { users: userMap };
        this.broadcastToFloor(socket.id, WebSocketEvents.SYNC_USERS, payload);
      });

      // Leave a room
      socket.on("leave", (room) => {
        socket.leave(room);
        this.socketToRoom.delete(socket.id);
        console.log(`${socket.id} left room: ${room}`);
      });

      // Handle disconnections
      socket.on("disconnect", () => {
        this.socketMap.delete(socket.id);
        this.socketToRoom.delete(socket.id);
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Send an event to all clients in the room
   */
  public broadcastToFloor<E extends keyof WebSocketPayloads>(
    senderId: string,
    event: E,
    payload: WebSocketPayloads[E]
  ): void {
    const room = this.socketToRoom.get(senderId);
    if (room) {
      this.io.to(room).emit(event, payload);
    } else {
      console.error(
        "Could not send message to room due to invalid sender or room"
      );
    }
  }
}
