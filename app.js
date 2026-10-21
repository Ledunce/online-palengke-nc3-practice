const loadButton = document.querySelector("#load-products");
const statusMessage = document.querySelector("#status");
const productList = document.querySelector("#product-list");

async function loadProducts() {
    loadButton.disabled = true;
    statusMessage.textContent = "Loading products";
    productList.replaceChildren();

try {
    const response = await fetch (
        "https://dummyjson.com/products?limit=6"
    );

    if (!response.ok){
        throw new Error('Request failed: ${response.status}');
    }

    const data = await response.json();

    for (const product of data.products){
        const card = document.createElement("article");
        card.className = "product-card"; 

        const name =  document.createElement("h2");
        name.textContent = product.title; 

        const productID = document.createElement("h3");
        productID.textContent  = "Product ID: " + product.id;

        const price = document.createElement("p");
        price.textContent = "Sample price:" + product.price;

        const description = document.createElement("p");
        description.textContent = "description: " + product.description;

        const stock = document.createElement("h3");
        stock.textContent = product.stock;

        card.append(name,price,productID,description,stock);
        productList.append(card);
    }

    statusMessage.textContent  = data.products.length + "products loaded.";

} catch (error) {
    statusMessage.textContent = 'Could not load products. please try again';

    console.error(error);
} finally {
  loadButton.disabled = false;
}
}
loadButton.addEventListener("click", loadProducts);
