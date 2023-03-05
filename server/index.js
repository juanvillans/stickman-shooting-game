const express =  require('express')
const app = express()
const http = require("http")
const {Server}= require("socket.io")
const cors = require("cors")

app.use(cors())

const server = http.createServer(app)

const io = new Server( server, {
    cors: {
        origin: "http://localhost:3000",
         
    }
})

io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`)
    
    socket.on("send_angle", (data) => {
        socket.broadcast.emit("receive_angle", data)
    })
    socket.on("send_shoot", (data) => {
        socket.broadcast.emit("receive_shoot", data)
    })
})

server.listen(3001)
// app.get('/', (req, res)=> {
//     console.log('ayyy')
//     res.send('<p>home page</p>')
// }) 