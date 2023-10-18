import {httpServer, io} from './src/app.js'
import config from './src/utils/global.config.js'
import connectDb from "./src/database/config.db.js";

io.on("connection", (socket) => {
  console.log("Connect socket: " + socket.id)
})

connectDb().then(() => {
  httpServer.listen(config.SERVER.PORT, () => {
    console.log(`Server listening on port ${config.SERVER.PORT}`)
  })
}).catch((error) => console.log(`${error} did not connect`))


