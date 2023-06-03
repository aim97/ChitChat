const app = require('express')();
const cors = require("cors");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const server = require("http").createServer(app)
const io = require("socket.io")(server, {
  cors: {
    origins: ["http://localhost:8080"]
  }
});

const JWT_SECRET = "sqwehkqwrv142q";
app.use(cors());
app.use(json());
app.post("/login", async (req, res) => {
  const { id } = req.body;
  if (id) {
    console.log({ body: req.body });
    const token = jwt.sign({ id }, JWT_SECRET);
    console.log({ generatedToken: token });
    res.status(200).send({ token });
  } else {
    res.status(401).send("What the heck man");
  }
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    console.log({ tokenToBeTested: token });
    const { id } = jwt.verify(token, JWT_SECRET);
    console.log({ messageReceivedFrom: id });
    socket.senderId = id;
    next();
  } catch(err) {
    console.log({ err });
    next(err)
  }
});
io.on("connection", (socket) => {
  console.log("Connected successfully to : ", socket.id);
  const customerId = socket.senderId;
  socket.on("message", (message) => {
    console.log("Message Received : ", { customerId, message });
    socket.broadcast.emit("message", `${customerId}: ${message}`);
  });
});

server.listen(3000, () => {
  console.log("Server started on port 3000 🚀🚀");
});