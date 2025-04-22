const socket = io();

socket.on("products",(data)=>{
    renderProducts(data);
});

//Renderizacion de productos
const renderProducts = (data) => {
    const containerProducts = document.getElementById("containerProducts");
    containerProducts.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
                            <p>ID: ${item.id}</p>
                            <p>Nombre: ${item.title}</p>
                            <p>Descripcion: ${item.description}</p>
                            <p>Precio: ${item.price}</p>
                            <p>Codigo: ${item.code}</p>
                            <p>Stock: ${item.stock}</p>
                            <p>Categoria: ${item.category}</p>
                            <button class="btn btn-primary"> Eliminar </button>
                        `
        containerProducts.appendChild(card);
        card.querySelector('button').addEventListener('click',() => {
            deleteProduct(item.id);
        });
    });
};

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
}

//Enviar producto con formulario

document.getElementById("btnSend").addEventListener("click", () => {
    addProduct();
});

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        status: document.getElementById("status").value === true,
        category: document.getElementById("category").value,
    }
    socket.emit("addProduct", product);
};