const jsonServer = require('json-server')
const path = require('path')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'data/staking.json'))
const middlewares = jsonServer.defaults()
server.use(jsonServer.bodyParser)
server.use(middlewares)
server.use(router)

server.listen(8000, () => {
  console.log('JSON Server is running')
})