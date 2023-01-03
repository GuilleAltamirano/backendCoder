const fs = require('fs')

class Contenedor {
    constructor(file){
        this.file = file;
    }

    async save () {
        let products = await this.getAll()
        try {
            let addId = 1
            products.forEach(product => {
                product.id = addId
                addId++
            });
            await fs.promises.writeFile(this.file, JSON.stringify(products))
        } catch (err) {console.log(`error => ${err}`)}
    }

    async getById (id) {
        try {
            let products = await this.getAll()
            let productSearch = products.find((product) => product.id == id)
            if (productSearch === undefined) {
                console.log(`The product ${id} is not defined`)
            }
            return productSearch
        } catch (err) {console.log(`error => ${err}`)}
    }

    async getAll () {
        try {
            let productsFile = await fs.promises.readFile(this.file, 'utf-8')
            let products = JSON.parse(productsFile)
            return products
        } catch (err) {console.log(`error => ${err}`)}
    }

    async deleteAll () {
        try {
            await fs.promises.writeFile(this.file, JSON.stringify([]))
        } catch (err) {console.log(`error => ${err}`)}
    }
    
    async getAddProduct (product) {
        try {
            if (product === undefined) {
                console.log(`The product ${id} is not defined`)
            } else {
                let products = await this.getAll()
                products.push(product)
                await fs.promises.writeFile(this.file, JSON.stringify(products))
            }
        } catch (err) {console.log(`error => ${err}`)}
    }

    async getDeleteId (id) {
        try {
            let products = await this.getAll()
            let search = id
            let productUp = products.filter((item) => item.id != search)
            await fs.promises.writeFile(this.file, JSON.stringify(productUp))
        } catch (err) {console.log(`error => ${err}`)}
    }

    async getProductUp (up, id) {
        try {
            let products = await this.getAll()
            let search = id
            let update = up
            let productsUp = products.filter((item) => item.id != search)
            let productUp = {...update, id: search}
            productsUp.push(productUp)
            await fs.promises.writeFile(this.file, JSON.stringify(productsUp))
        } catch (err) {console.log(`error => ${err}`)}
    }
}

module.exports = Contenedor;