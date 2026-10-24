# vue-project
Node.js version tested: v24.22.1.

## Purpose and intended users
this is for me for practices and possible reference on the assessment 

## Implemented features
A Vue-based product-management application supporting product creation, loading, price increases, and deletion. It includes frontend validation, loading feedback, and request-error messages


## Architecture
Create
Having input on the fields and adding creates an POST request and saves it on the db.json 
Vue collects and validates input, then sends POST /products. JSON Server saves the product in db.json and returns a response.

Read
Clicking on the Load products, makes a get request and parse the json file it request and displays it as cards 
Load Products sends GET /products. Vue parses the JSON response and displays product cards.

Clicking Increase Price calculates the proposed price and sends PATCH /products/:id. After success, Vue updates the displayed product using the confirmed response.


update 
the update part is a bit tricky but a user will first need to see the loaded products, then the update part comes in on the increase the price by 5 button 
this can be used as an activity to add a changeable increase 


delete like update the card must be there inorder for the user to click delete. once the delete has been click it will create a DELETE request then removes the item (based on the productid) from the db.json 
Clicking Delete sends DELETE /products/:id. After successful deletion, Vue removes the matching product from its displayed list.
## Project Setup

```powershell 
npm install
```

### Compile and Hot-Reload for Development

```powershell 
npm run dev
```

### Compile and Minify for Production

```powershell 
npm run build
```

# From the repository root
cd vue-project

# Install dependencies using the committed lockfile
npm ci

# Terminal 1: start the practice API
npm run api

# Terminal 2, in vue-project: start development
npm run dev

# Build the frontend
npm run build

# Preview the built frontend
npm run preview



Method	Endpoint	Purpose
GET	/products	Retrieve products
GET	/products/:id	Retrieve one product
POST	/products	Create a product
PATCH	/products/:id	Update supplied fields
DELETE	/products/:id	Delete a product

- JSON Server is the practice backend.
- Direct API requests can bypass frontend validation.
- Authentication, authorization, and session enforcement were discussed but have not been demonstrated in this mock API.
- List only implemented features. Keep planned cart/order features separate if your current Vue application only manages products.