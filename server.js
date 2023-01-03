const express = require('express')
const { Router } = express
const handlebars = require("express-handlebars")
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
//express
const app = express()
const httpServer = HttpServer(app)
const io = new IOServer(httpServer)
const PORT = process.env.PORT || 8080
//router
const productsRouter = new Router()

//app use
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.engine("handlebars", handlebars.engine())

app.set('views', './views')
app.set('view engine', 'handlebars')

//db Control
const Contenedor = require('./src/containers/products')
let container = new Contenedor('./db/products.txt')

const ContenedorComment = require('./src/containers/commentsControl')
let containerComment = new ContenedorComment('./db/comments.txt')

//socket
io.on('connection', async socket => {
    const comments = await containerComment.getAll()
    const products = await container.getAll()
    socket.emit('products', products)
    socket.emit('comments', comments)

    socket.on('newProduct', async prod => {
        await container.getAddProduct(prod)
    })

    socket.on('newSms', async i => {
        await containerComment.getAdd(i)
    })


})

//get
productsRouter.get('/', (req, res) => {
    res.render('index')
})

app.use('/api/products', productsRouter)
//server
httpServer.listen(PORT, () => {
    console.log(`Server HTTP run in PORT ${PORT}`)
})