const express = require('express')
const fs = require('fs')
const { Router } = express
//express
const app = express()
const PORT = process.env.PORT || 8080
//router
const productsRouter = new Router()

//app use
app.use('/api/form', express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

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
    res.send(container.getAll())
})
productsRouter.get('/:id', (req, res) => {
    const search = req.params.id;
    if (search === undefined || search === null) {
        res.send({"error": `The product is not defined`})
    } else {
        res.send(container.getById(search))
    }
})
//post
productsRouter.post('/', (req, res) => {
    let product = req.body;
    container.getAddProduct(product)
    res.send({"productAdd": product})
})
//put
productsRouter.put('/:id', (req, res) => {
    let productUp = req.body;
    let search = req.params.id;
    container.getProductUp(productUp, search)
    res.send({"ok": productUp})
})
//delete
productsRouter.delete('/:id', (req, res) => {
    let search = req.params.id
    container.getDeleteId(search)
    res.send({"ok": `The product delete ${search}`})
})

//app use routes
app.use('/api/products', productsRouter)



//server
const server = app.listen(PORT, () => {
    console.log(`Server HTTP run in PORT ${PORT}`)
})