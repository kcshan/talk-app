import http from 'http'
import path from 'path'
import { Server } from 'socket.io'
import express from "express";

const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
})

const httpServer = http.Server(app)

const io = new Server(httpServer, { cors: { origin: "*" } })
const users = [];

io.on("connection", (socket) => {
    socket.on("onLogin", (user) => {
        const updatedUser = {
            ...user,
            online: true,
            socketId: socket.id,
            messages: []
        }
        const existUser = users.find((x) => x.name === updatedUser.name)
        if (existUser) {
            existUser.socketId = socket.id;
            existUser.online = true;
        } else {
            users.push(updatedUser)
        }
        const admin = users.find((x) => x.name === 'Admin' && x.online);
        if (admin) {
            io.to(admin.socketId).emit("updateUser", updatedUser);
        }
        if (updatedUser.name === 'Admin') {
            io.to(updated.socketId).emit('listUsers', users)
        }
    })

    socket.on("disconnect", () => {

    }) 

    socket.on("onUserSelected", (user) => {

    })

    socket.on("onMessage", (message) => {

    })
})

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})