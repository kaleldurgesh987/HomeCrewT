export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join room for a specific job tracking/negotiation
    socket.on('join-job', (jobId) => {
      socket.join(`job_${jobId}`);
      console.log(`[Socket.io] ${socket.id} joined room job_${jobId}`);
    });

    socket.on('leave-job', (jobId) => {
      socket.leave(`job_${jobId}`);
      console.log(`[Socket.io] ${socket.id} left room job_${jobId}`);
    });

    // Join room for worker direct notifications
    socket.on('join-worker', (workerId) => {
      socket.join(`worker_${workerId}`);
      console.log(`[Socket.io] Worker ${workerId} joined private channel`);
    });

    // Worker broadcasts live moving location during 'on_the_way' or active job
    socket.on('worker-location', (data) => {
      const { jobId, workerId, coordinates } = data;
      // Broadcast to clients watching this job
      if (jobId) {
        socket.to(`job_${jobId}`).emit('worker-location', {
          jobId,
          workerId,
          coordinates,
          timestamp: new Date(),
        });
      }
      // Also broadcast generally for live map views
      socket.broadcast.emit('worker-location-update', {
        workerId,
        coordinates,
        timestamp: new Date(),
      });
    });

    // Emergency SOS Alert event
    socket.on('sos-alert', (data) => {
      const { jobId, userId, userName, role, coordinates, message } = data;
      console.warn(`[SOS ALERT] From ${userName} (${role}) for Job ${jobId}: ${message}`);
      io.emit('sos-alert-broadcast', {
        jobId,
        userId,
        userName,
        role,
        coordinates,
        message,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};
