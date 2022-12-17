const express = require('express')
const fs = require('fs')
const { Router } = express
const handlebars = require("express-handlebars")
//express
const app = express()
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
class Contenedor {
    constructor(file){
        this.file = file;
    }

    save () {
        let products = this.getAll()
        try {
            let addId = 1
            products.forEach(product => {
                product.id = addId
                addId++
            });
            fs.writeFileSync(this.file, JSON.stringify(products))
        } catch (err) {console.log(`error => ${err}`)}
    }

    getById (id) {
        try {
            let products = this.getAll()
            let productSearch = products.find((product) => product.id == id)
            if (productSearch === undefined) {
                console.log(`The product ${id} is not defined`)
            }
            return productSearch
        } catch (err) {console.log(`error => ${err}`)}
    }

    getAll () {
        try {
            let productsFile = fs.readFileSync(this.file, 'utf-8')
            let products = JSON.parse(productsFile)
            return products
        } catch (err) {console.log(`error => ${err}`)}
    }

    deleteAll () {
        try {
            fs.writeFileSync(this.file, JSON.stringify([]))
        } catch (err) {console.log(`error => ${err}`)}
    }
    
    getAddProduct (product) {
        try {
            if (product === undefined) {
                console.log(`The product ${id} is not defined`)
            } else {
                let products = this.getAll()
                products.push(product)
                fs.writeFileSync(this.file, JSON.stringify(products))
            }
        } catch (err) {console.log(`error => ${err}`)}
    }

    getDeleteId (id) {
        try {
            let products = this.getAll()
            let search = id
            let productUp = products.filter((item) => item.id != search)
            fs.writeFileSync(this.file, JSON.stringify(productUp))
        } catch (err) {console.log(`error => ${err}`)}
    }

    getProductUp (up, id) {
        try {
            let products = this.getAll()
            let search = id
            let update = up
            let productsUp = products.filter((item) => item.id != search)
            let productUp = {...update, id: search}
            productsUp.push(productUp)
            fs.writeFileSync(this.file, JSON.stringify(productsUp))
        } catch (err) {console.log(`error => ${err}`)}
    }
}
const container = new Contenedor('./db/products.txt')

//get
productsRouter.get('/', (req, res) => {
    let products = container.getAll()
    res.render('products', {products})
})
productsRouter.get('/form', (req, res) => {
    res.render('form')
})
//post
productsRouter.post('/form', (req, res) => {
    let product = req.body;
    container.getAddProduct(product)
    res.send({"productAdd": product})
})

//app use routes
app.use('/api/products', productsRouter)



//server
const server = app.listen(PORT, () => {
    console.log(`Server HTTP run in PORT ${PORT}`)
})