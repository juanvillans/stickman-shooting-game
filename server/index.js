import express from  'express'
import http from "http"
import {Server} from  "socket.io"
import cors from "cors"
import {dirname, join} from "path"
import { fileURLToPath } from 'url'

const app =  express()
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(cors())
const server = http.createServer(app)
console.log(__dirname)
const io = new Server( server, {
    cors: {
        origin: "https://stickman-shooting-game.adaptable.app/",
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

app.use(express.static(join(__dirname, '../client/build')))
server.listen(process.env.PORT || 3001)
app.get('/', (req, res)=> {
    console.log('ayyy')
    res.send('<p>home page</p>')
})  