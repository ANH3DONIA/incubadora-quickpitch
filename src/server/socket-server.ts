import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const PORT = process.env.SOCKET_PORT ? parseInt(process.env.SOCKET_PORT) : 3002;

const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'QuickPitch WebSocket Server Running', port: PORT }));
});

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

interface Participant {
  socketId: string;
  userId: string;
  name: string;
  role: 'ENTREPRENEUR' | 'INVESTOR' | 'ADMIN';
  isReady: boolean;
}

interface RoomState {
  sessionId: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'EXPIRED' | 'COMPLETED';
  totalSeconds: number;
  remainingSeconds: number;
  timerInterval: NodeJS.Timeout | null;
  participants: Map<string, Participant>;
}

const rooms = new Map<string, RoomState>();

function getOrCreateRoom(sessionId: string): RoomState {
  if (!rooms.has(sessionId)) {
    rooms.set(sessionId, {
      sessionId,
      status: 'WAITING',
      totalSeconds: 180, // 3 minutos estándar
      remainingSeconds: 180,
      timerInterval: null,
      participants: new Map(),
    });
  }
  return rooms.get(sessionId)!;
}

function serializeRoom(room: RoomState) {
  return {
    sessionId: room.sessionId,
    status: room.status,
    totalSeconds: room.totalSeconds,
    remainingSeconds: room.remainingSeconds,
    participants: Array.from(room.participants.values()),
  };
}

io.on('connection', (socket: Socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);

  // Unirse a una sala
  socket.on('join_room', (data: { sessionId: string; userId: string; name: string; role: any }) => {
    const { sessionId, userId, name, role } = data;
    socket.join(sessionId);

    const room = getOrCreateRoom(sessionId);
    room.participants.set(socket.id, {
      socketId: socket.id,
      userId,
      name: name || 'Participante',
      role: role || 'INVESTOR',
      isReady: false,
    });

    console.log(`👤 ${name} (${role}) se unió a la sala ${sessionId}`);
    io.to(sessionId).emit('room_state', serializeRoom(room));
  });

  // Alternar estado de "Listo" en la sala de espera
  socket.on('toggle_ready', (data: { sessionId: string; isReady: boolean }) => {
    const { sessionId, isReady } = data;
    const room = rooms.get(sessionId);
    if (!room) return;

    const participant = room.participants.get(socket.id);
    if (participant) {
      participant.isReady = isReady;
      io.to(sessionId).emit('room_state', serializeRoom(room));
    }
  });

  // Iniciar el Quick Pitch con cronómetro estricto en el servidor
  socket.on('start_pitch', (data: { sessionId: string; durationSeconds?: number }) => {
    const { sessionId, durationSeconds } = data;
    const room = rooms.get(sessionId);
    if (!room || room.status === 'IN_PROGRESS') return;

    const duration = durationSeconds || room.totalSeconds;
    room.status = 'IN_PROGRESS';
    room.totalSeconds = duration;
    room.remainingSeconds = duration;

    if (room.timerInterval) {
      clearInterval(room.timerInterval);
    }

    console.log(`⏱️ Iniciando cronómetro de servidor para la sala ${sessionId} (${duration}s)`);
    io.to(sessionId).emit('timer_start', {
      totalSeconds: room.totalSeconds,
      remainingSeconds: room.remainingSeconds,
    });
    io.to(sessionId).emit('room_state', serializeRoom(room));

    // Contador regresivo sincronizado cada 1 segundo
    room.timerInterval = setInterval(() => {
      room.remainingSeconds -= 1;

      io.to(sessionId).emit('timer_tick', {
        remainingSeconds: room.remainingSeconds,
        totalSeconds: room.totalSeconds,
      });

      // Al llegar a 00:00 el servidor detiene el timer y emite la expiración
      if (room.remainingSeconds <= 0) {
        if (room.timerInterval) clearInterval(room.timerInterval);
        room.timerInterval = null;
        room.status = 'EXPIRED';
        room.remainingSeconds = 0;

        console.log(`🔔 ¡Tiempo expirado en la sala ${sessionId}! Habilitando fase de inversión.`);
        io.to(sessionId).emit('timer_expired', { sessionId });
        io.to(sessionId).emit('room_state', serializeRoom(room));
      }
    }, 1000);
  });

  // Notificación de Micro-Inversión recibida
  socket.on('send_investment', (data: { sessionId: string; amount: number; currency: string; gateway: string; investorName: string }) => {
    console.log(`💰 Micro-inversión recibida en sala ${data.sessionId}: $${data.amount} ${data.currency} vía ${data.gateway}`);
    io.to(data.sessionId).emit('investment_received', data);
  });

  // Desconexión de cliente
  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
    for (const [sessionId, room] of rooms.entries()) {
      if (room.participants.has(socket.id)) {
        const p = room.participants.get(socket.id);
        room.participants.delete(socket.id);
        io.to(sessionId).emit('user_left', { socketId: socket.id, name: p?.name });
        io.to(sessionId).emit('room_state', serializeRoom(room));

        // Si la sala queda vacía, limpiar el intervalo
        if (room.participants.size === 0 && room.timerInterval) {
          clearInterval(room.timerInterval);
          room.timerInterval = null;
        }
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 QuickPitch WebSocket Server activo en http://localhost:${PORT}`);
});
