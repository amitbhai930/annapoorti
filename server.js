// server.js (Socket.IO v4, mac-ready)
const http = require("http");
const { Server } = require("socket.io");

const PORT = 4000;
let lat = 12.9716,
    lng = 77.5946;

// Start HTTP and Socket.IO
const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: /http:\/\/(localhost|127\.0\.0\.1):\d+$/, // allow Live Server
        methods: ["GET", "POST"],
        credentials: false
    }
});
const storage = {
    get(k, def) {
        try {
            const raw = localStorage.getItem(k);
            const val = raw !== null ? JSON.parse(raw) : null;
            return (val === null || val === undefined) ? def : val;
        } catch (e) {
            return def;
        }
    },
    set(k, v) {
        try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore or show a message if you want */ }
    }
};

io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);
    socket.emit("driverLocation", { lat, lng });
    socket.on("disconnect", (reason) => {
        console.log("❎ Client disconnected:", socket.id, reason);
    });
});

// simple simulator (optional)
setInterval(() => {
    lat += (Math.random() - 0.5) * 0.0004;
    lng += (Math.random() - 0.5) * 0.0004;
    io.emit("driverLocation", { lat, lng });
}, 1200);

server.listen(PORT, () => {
    console.log(`✅ Socket.IO on http://localhost:${PORT}`);
});