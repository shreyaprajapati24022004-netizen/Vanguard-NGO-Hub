const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const socketHandler = require("./socket/socketHandler");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.set("io", io);

app.use("/api/auth",       require("./routes/authRoutes"));
app.use("/api/surveys",    require("./routes/surveyRoutes"));
app.use("/api/volunteers", require("./routes/volunteerRoutes"));
app.use("/api/match",      require("./routes/matchRoutes"));
app.use("/api/needs",      require("./routes/needRoutes"));


app.get("/", (req, res) => {
  res.json({ message: "Vanguard NGO Hub API is running 🚀" });
});


socketHandler(io);   


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});