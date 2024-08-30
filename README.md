
# Shopping Cart 

This is a simple ecommerce store with functionalities where clients can add items to cart and checkout to successfully place the order. Every *n*th order will be eligible to apply the discount on the overall order. This *n*th order will be configurable from env variables and depending on this users can avail discounts on their orders. 

Admin can create these discount codes using admin APIs, there are no limitations on creating discount codes for admin. There is check for minimum length for discount code, again this is configurable from configs. 

**NOTE:** This is not using any backend store, all the data is stored in-memory and will reset on each server reload/restart.


## User APIs

| API  | Description |
|:------------- |:-------------|
| Product List     | This returns all the products which can be added to the cart. Add to cart API accepts productId as input which can be referenced from here.    |
| Add to cart      | This allows users to add items to the cart. Only products available in product list can be added to the cart.     |
|  Fetch Cart      | This allows users to fetch the items in the cart.      |
| Checkout          | This API is used for checkout the items in the cart. This accepts `code` as request body param and will be applicable for eligible orders else this API will return the error |
| Fetch Discount codes | This API can be used to fetch the available discount codes. Note that this will return codes for all the users even if they are not eligible. |

## Admin APIs 

| API  | Description |
|:------------- |:-------------|
| Orders List     | This returns all the purchased orders with information like, total amount paid, total discount etc.    |
| Metrics      | This API returns overall metircs for the orders like totalPurchasedAmount, totalItemsPurchased, totalDiscountAmount, discountCodesUsed etc     |
|  Generate Discount Code      | This API is used to generate the discount codes for users. Admin can generate as many codes they want. There is a check for unique code, once code is used by user then admin can add the same code again.      |


After running the project you can access the API documentation at 


## Running locally 

### Prerequisites
Ensure you have the following tools installed on your machine:

 - Node.js (version 18 or higher)
 - npm (Node Package Manager)
 - Git (optional, for cloning the repository)
 
### Installation 

```
# clone the repository
git clone https://github.com/your-username/uniblox-shopping-cart.git

# navigate to project direcory 
cd uniblox-shopping-cart

# install dependencies
npm install

```

### Available scripts

* Starting development server

```
npm run dev 
```
This will start the server using ts-node and watch for changes with nodemon.

* Start the production build:
```
npm start
```

This will run the compiled JavaScript files in the dist directory.

* Build the project:
```
npm run build
```

This will compile TypeScript files into JavaScript files in the dist directory.

* Run tests
```
npm test
```

This will run the test suite using Jest. Ensure your .env.test file is set up correctly for testing purposes.

### Access the API documentation:

After running the project using `npm run dev` open http://localhost:3000/api-docs in your browser to view the Swagger UI.


## Improvements

* Use common error handler to handle all the errors across the app.
* Use common handler to return the response. 