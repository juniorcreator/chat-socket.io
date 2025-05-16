import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }
});

io.on("connection", (socket) => {
  console.log('✅ Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});







app.get('/', (req, res) => {
  res.send('<h1>Socket.IO server is running</h1>');
});

server.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
