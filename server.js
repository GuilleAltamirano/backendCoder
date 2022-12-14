const fs = require('fs')

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
}

const container = new Contenedor('./db/products.txt')
container.deleteAll()

