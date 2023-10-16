import {httpServer, io} from './src/app.js'
import config from './src/utils/global.config.js'

io.on("connection", (socket) => {
  console.log("Connect socket")
})

httpServer.listen(config.SERVER.PORT, () => {
  console.log(`Example app listening on port ${config.SERVER.PORT}`)
})

