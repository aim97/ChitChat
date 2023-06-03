import { io } from "socket.io-client";
const baseServerUrl = "http://localhost:3000";
const currentUser = {};

const socketConnection = {
  socket: null,
  auth: "",
  async sendMessage(message) {
    if(this.socket) {
      console.log({socket, message});
      this.socket.emit("message", message);
    }
  }
}
let socket = null;

const connect = async () => {
  const me = `user(${Math.floor(Math.random()*100)})`
  const res = await fetch(`${baseServerUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: me }),
  });
  console.log(res);
  const { token } = await res.json();
  currentUser.id = me;
  currentUser.token = token;
  socket = io(baseServerUrl, {
    auth: { token }
  });
  socketConnection.socket = socket;
  socketConnection.auth = token;
  socket.on("message", (message) => {
    const [senderName, msg] = message.split(":")
    addMessage(senderName, msg);
  })
}

// elements
const messagesField = document.getElementById("messages");
const submitBtn = document.getElementById("send");
const inputMessage = document.getElementById("message");

const formMessage = (senderName, message) => {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");
  messageContainer.textContent = `${senderName}: ${message}`;
  return messageContainer
}

const addMessage = (senderName, message) => {
  const messageElement = formMessage(senderName, message);
  messagesField.append(messageElement)
}

submitBtn.addEventListener("click", ((e) => {
  e.preventDefault();
  console.log("hello");
  const message = inputMessage.value;
  if (message) {
    socketConnection.sendMessage(message);
    addMessage(currentUser.id, message);
  }
}));

window.onload = connect;