const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // Volunteer apne userId se room join kare
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`✅ User ${userId} joined their room`);
    });

    // NGO ya Admin kisi ko notification bheje
    socket.on("sendNotification", ({ userId, message }) => {
      io.to(userId).emit("notification", { message });
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;