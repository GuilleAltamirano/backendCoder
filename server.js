const express = require('express')
const fs = require('fs')
const { send } = require('process')
const { Router } = express
//express
const app = express()
const PORT = process.env.PORT || 8080
//router
const productsRouter = new Router()

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
            if (productSearch == undefined) {
                console.log(`The product ${id} is not defined`)
            }
            return productSearch
        } catch (err) {console.log(`error => ${err}`)}
    }

    getAll () {
        let productsFile = fs.readFileSync(this.file, 'utf-8')
        let products = JSON.parse(productsFile)
        return products
    }

    deleteAll () {
        try {
            fs.writeFileSync(this.file, JSON.stringify([]))
        } catch (err) {console.log(`error => ${err}`)}
    }
    
    getAddProduct (product) {
        try {
            let products = this.getAll()
            products.push(product)
            fs.writeFileSync(this.file, JSON.stringify(products))
        } catch (err) {console.log(`error => ${err}`)}
    }

    getDeleteId (id) {
        try {
            let products = this.getAll()
            products.forEach(product => {
                if (product === id) {
                    product = {}
                }
            });
        } catch (err) {console.log(`error => ${err}`)}
    }
}
const container = new Contenedor('./db/products.txt')

//get
productsRouter.get('/', (req, res) => {
    res.send(container.getAll())
})
productsRouter.get('/:id', (req, res) => {
    let productSearch = req.params
    res.send(container.getById(productSearch))
})
//post
productsRouter.post('/', (req, res) => {
    let product = req.body;
    if (product == undefined) {
        res.send({"error": `The product is not defined`})
    } else {
        res.send(container.getAddProduct(product))
    }
})
//put
productsRouter.put('/:id', (req, res) => {
    let search = req.params
    let newProduct = req.body
    if (container.getById(search) == undefined || container.getById(search) == null) {
        res.send({"error": `The product ${search} is not defined`})
    } else {
        if (newProduct == undefined || newProduct == null) {
            res.send({"error": `The product updated is not defined`})
        } else {
            container.getDeleteId(search)
            container.getAddProduct(newProduct)
            res.send({"ok": `The product updated ${newProduct}`})
        }
    }
})

//delete
productsRouter.delete('/:id', (req, res) => {
    let search = req.params
    if (container.getById(search) == undefined || container.getById(search) == null) {
        res.send({"error": `The product ${search} is not defined`})
    } else {
        container.getDeleteId(search)
        res.send({"ok": `The product delete ${search}`})
    }
})

//app use
app.use('/api/products', productsRouter)
app.use('/api/form', express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: true}))


//server
const server = app.listen(PORT, () => {
    console.log(`Server HTTP run in PORT ${PORT}`)
})