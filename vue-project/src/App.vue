<script setup>
import {ref} from "vue";

const products = ref ([]);

const newTitle = ref("");
const newPrice = ref("");
const statusMessage = ref(""); 

const saving = ref(false);

const updating = ref(false);
//this is to update products

async function increasePrice(product){
  if (updating.value){
    return;
  }
  updating.value = true;
  statusMessage.value = "Updating price...";

  try {
    const response = await fetch(
      "http://127.0.0.1:3000/products/" + product.id, 
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          price: product.price + 5
        })
      }
    );

    if (!response.ok){
      throw new Error("Request failed: " + response.status);

    }

    const updatedProduct = await response.json();

    product.price = updatedProduct.price;

    statusMessage.value = 
    updatedProduct.title + " price saved.";
  } catch (error){
    statusMessage.value = "could not update the price. check the local api";
    console.error(error);
  } finally {
    updating.value = false; 
  }

}



//this is to add products 
async function addProduct(){
  if(saving.value){
    return;
  }


const title = newTitle.value.trim();
const price = newPrice.value;

if (
  title === "" || !Number.isFinite(price) ||
  price < 0
) {
  statusMessage.value = 
  "Enter a product name and a valid nonnnegative price.";
  return;
}

saving.value = true;
statusMessage.value = "Saving product....";

try {
  const response = await fetch(
    "http://127.0.0.1:3000/products",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        price: price
      })
    }
  );
   
  if(!response.ok){
    throw new Error("Request failed: " + response.status);
  }
   
  const createdProduct = await response.json();

  products.value.push(createdProduct);

  statusMessage.value = createdProduct.title + " saved.";

  newTitle.value = "";
  newPrice.value = "";
} catch (error){
  statusMessage.value = 
  "Could not save the product. Check the local API";

  console.error(error);
} finally {
  saving.value = false; 
}
}

const deleting = ref (false);

//for deletion 
async function deleteProduct(productId){
  if (deleting.value){
    return;
  }

  const confirmed = window.confirm(
    "Delete product ID " + productId + "?"
  ); 

  if (!confirmed) {
    return;
  }

  deleting.value = true;
  statusMessage.value = "Deleting product...";

  try {
    const response = await fetch(
      "http://127.0.0.1:3000/products/" + productId,
      {
        method: "DELETE"
      }
    );

    if(!response.ok){
      if (response.status === 404){
        statusMessage.value = "This product no longer exists. Reload the product list.";
        return;
      }
      throw new Error("Request failed: " + response.status);
    }

    products.value = products.value.filter(
      product => product.id !== productId 
    );

    statusMessage.value = "Product " + productId + " deleted.";
  } catch (error) {
    statusMessage.value= "could not delete the product. check the local api";
    
    console.error(error);
  } finally {
    deleting.value = false; 
  }
}

const loading = ref(false);

async function  loadProducts() {
  loading.value = true;
  statusMessage.value = "Loading products...";
  
  try {
    const response = await fetch(
      "http://127.0.0.1:3000/products"
    );

    if (!response.ok){
      throw new Error("Request failed: " + response.status);
    }
  
    const data = await response.json();
    
    products.value = data; 

    statusMessage.value = 
    products.value.length + " products loaded.";

  } catch (error) {
    statusMessage.value = 
    "Could not load products. check that local api is running.";

    console.error(error);
  } finally {
    loading.value = false;
  }

}
</script>

<template>
  <main>
    <h1>Online Palengke</h1>
      <!--adding-->   
     <form @submit.prevent="addProduct" class="product-card">
      <h2>Add a Product</h2>
      <p>
        <label for="new-title">Product name</label>
        <input 
        id="new-title"
        v-model="newTitle"
        type="text"
        required>
      </p>
      <p>
        <label for="new-price">Price</label>
        <input
         id="new-price"
         v-model.number="newPrice"
         type="number"
         min="0"
         step="0.01"
         required
         >
      </p>
      <button type="submit" :disabled="saving">
        {{ saving ? "Saving...." : "Add Product" }}
      </button>

      <button type="button" :disabled="loading" @click="loadProducts">
      {{ loading ? "Loading... " : "Load Products" }}
    </button>
      </form>

      <p role="status">{{ statusMessage }}</p>
 
      <p>{{products.length}} products available.</p>

      <section class="product-grid" aria-label="Available product">
        <article
           v-for="product in products"
           :key="product.id"
           class="product-card"
           >
           <h2>{{product.title}}</h2>
           <p>Product ID: {{product.id}}</p>
           <p>Price: PHP{{product.price}}</p>

           <button 
              type="button" :disabled="updating"
              @click="increasePrice(product)"
              >
              Increase price by PHP 5
           </button>


           <button
           type="button" :disabled="deleting"
           @click="deleteProduct(product.id)"
           >Delete Product</button>
          </article>
        </section>
      </main>
    </template>

<style>
body {
  margin: 0;
  display: block;
  background: #f3f4f6;
  color: #1f2937;
  font-family: Arial, sans-serif;
}

#app {
  display:block;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.product-card {
    padding: 24px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 8px;
}

button {
    padding: 12px 18px;
    background: #166534;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

@media (min-width: 600px) {
    .product-grid {
        grid-template-columns: 1fr 1fr;
    }
}
</style>