import { Server } from 'socket.io';
import {app, socketServer} from './src/app.js'
import config from './src/utils/global.config.js'
import { createServer } from "http";

const httpServer = createServer(app)
const io = new Server(httpServer, {})
io.on("connection", (socket) => {
  console.log("Connect socket")
})
// socketServer.on("connection", (socket) => {
//   console.log("Connect socket")
// })
// const serverApp = app.listen(config.SERVER.PORT, () => {
//   console.log(`Example app listening on port ${config.SERVER.PORT}`)
// })
httpServer.listen(config.SERVER.PORT, () => {
  console.log(`Example app listening on port ${config.SERVER.PORT}`)
})

// socketServer.attach(serverApp)