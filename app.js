const loadButton = document.querySelector("#load-products");
const statusMessage = document.querySelector("#status");
const productList = document.querySelector("#product-list");

const productForm = document.querySelector("#product-form");
const titleInput = document.querySelector("#product-title");
const priceInput = document.querySelector("#product-price");
const descInput = document.querySelector("#product-description");
const stockInput = document.querySelector("#product-stock");
const createButton = document.querySelector("#create-product");
const createStatus = document.querySelector("#create-status");



async function createProduct(event){
    event.preventDefault();
     
    const newProduct = {
        title: titleInput.value.trim(),
        price: priceInput.valueAsNumber,
        description: descInput.value,
        stock: stockInput.valueAsNumber
    };

    if (
        newProduct.title == "" ||
        !Number.isFinite(newProduct.price)
        || newProduct.description == "" || !Number.isInteger(newProduct.stock) ||
        newProduct.price <= 0 ||  newProduct.stock < 0 

    ) {
        createStatus.textContent = 
        "Enter a product name and a valid nonnegative price.";
        return;
    }

    createButton.disabled = true;
    createStatus.textContent = "Sending product....";

    try {
        const response = await fetch (
            "https://dummyjson.com/products/add",
            {
               method: "POST",
               headers: {
                "Content-Type": "application/json"
               },
               body: JSON.stringify(newProduct)
            }
        );

        if (!response.ok){
            throw new Error("Request failed " + response.status )
        }

        const createdProduct = await response.json();
        console.log("API response:", createdProduct);

        const card = document.createElement("article");
        card.className = "product-card";

        const name = document.createElement("h2");
        name.textContent = createdProduct.title;

        const price = document.createElement("p");
        price.textContent = "sample price: " + createdProduct.price;

        const productID = document.createElement("p");
        productID.textContent = "product id: " + createdProduct.id;

        const description = document.createElement("p");
        description.textContent = "Description " + createdProduct.description;

        const stock = document.createElement("h2");
        stock.textContent = "stock: " + createdProduct.stock;

        card.append(name,price,productID,description,stock);
        productList.prepend(card);

        createStatus.textContent = "API accepted " + createdProduct.title + ", This is simulated creation";

        productForm.reset();
    } catch (error){
        createStatus.textContent = "could not create the product try again";

        console.error(error);
    } finally {
        createButton.disabled = false; 
    }

}

productForm.addEventListener("submit", createProduct);





//to load products

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
