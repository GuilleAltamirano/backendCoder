const socket = io()

socket.on('products', async data => {
    
    const containerProds = document.getElementById('products')

    if (data.length >= 1) {
        let product = await data
        product.map(prod => {
            containerProds.innerHTML += `
            <div class="containerProd">
                <h3 class="titleProd">${prod.title}</h3>
                <p class="priceProd">${prod.price}</p>
                <img src='${prod.thumbnail}' class="imgProd">
            </div>
            `
        })
        .join(" ")

    } else {
        containerProds.innerHTML = `<h2>out of stock</h2> `
    }
    
    
})

socket.on('comments', async data => {
    const containerComm = document.getElementById('feedbacks')

    if (data.length >= 1) {
        let comments = await data
        comments.map(item => {
            containerComm.innerHTML += `
            <div class="containerComments">
                <h4 class="user">${item.user}</h4>
                <p class="sms">${item.sms}</p>
                <p class="fyh">${item.fyh}</p>
            </div>
            `
        })
    } else {
        containerProds.innerHTML = `<h2>out of comment</h2> `
    }
})

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    }

    socket.emit("newProduct", product)
    return
}

const addComment = () => {
    const sms = {
        user: document.getElementById("user").value,
        fyh: new Date(Date.now()).toLocaleString(),
        sms: document.getElementById("sms"). value
    }
    
    socket.emit("newSms", sms)
    return
}