// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose
//   .connect(
//     "mongodb+srv://demon7181:HiNHckNi4yy4CbAO@cluster0.vs3li7a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//   )
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// const productRoutes = require("./routes/productRoutes.js");
// const categoryRoutes = require("./routes/categoryRoutes.js");
// const authRoutes = require("./routes/auth.js");
// const dashboardRoutes = require("./routes/dashboard.js");
// const orderRoutes = require("./routes/orderRoutes.js");
// const adminTokenRoutes = require("./routes/adminTokenRoutes.js");
// const notificationRoutes = require("./routes/notificationRoutes");

// app.use("/api/products", productRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/save-admin-token", adminTokenRoutes);
// app.use("/api/notifications", notificationRoutes);

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const https = require("https"); // ✅ Added for Socket.IO support
const socketIo = require("socket.io"); // ✅ Socket.IO server

dotenv.config();

const app = express();
const server = https.createServer(app); // ✅ Create HTTP server instance

const io = socketIo(server, {
  cors: {
    origin: "*", // ✅ You can restrict this to your frontend domain
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// ✅ Make io globally accessible inside route handlers
app.locals.io = io;

// ✅ Connect MongoDB
mongoose
  .connect(
    "mongodb+srv://demon7181:HiNHckNi4yy4CbAO@cluster0.vs3li7a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ✅ Routes
const productRoutes = require("./routes/productRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const authRoutes = require("./routes/auth.js");
const dashboardRoutes = require("./routes/dashboard.js");
const orderRoutes = require("./routes/orderRoutes.js");
const adminTokenRoutes = require("./routes/adminTokenRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/save-admin-token", adminTokenRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Start server with Socket.IO
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
