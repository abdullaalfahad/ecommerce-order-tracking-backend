import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('client connected', socket.id);

    socket.on('joinOrderRoom', (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log('joined', `order:${orderId}`);
    });

    socket.on('leaveOrderRoom', (orderId: string) => {
      socket.leave(`order:${orderId}`);
      console.log('left', `order:${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log('client disconnected', socket.id);
    });
  });
};

export { io };
