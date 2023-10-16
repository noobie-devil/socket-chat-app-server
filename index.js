import {app, socketServer} from './src/app.js'
import config from './src/utils/global.config.js'

socketServer.on("connection", (socket) => {
  console.log("Connect socket")
})
const serverApp = app.listen(config.SERVER.PORT, () => {
  console.log(`Example app listening on port ${config.SERVER.PORT}`)
})

socketServer.attach(serverApp)