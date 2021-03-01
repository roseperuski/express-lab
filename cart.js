const { request } = require("express");
const express = require("express");
const cart = express.Router();
const pool = require('./pg-connection-pool');

//logic for endpoints
const cartList = [
  { id: 1, product: "Bleeperblorp", price: 100, quantity: 2 },
  { id: 2, product: "Cat scratcher", price: 10, quantity: 30 },
  { id: 3, product: "Whiskey sauce", price: 100000000, quantity: 1 },
  { id: 4, product: "Extra long phone cord", price: 3, quantity: 42 },
];

cart.get("/", (req, res) => {
  let items = [];  
  pool.query("SELECT * FROM shopping_cart;").then( (results) => {
    items = results.rows  
    console.log(items);
    // res.json(results.rows);
  let filteredItems = items
  if (req.query) {
     if (req.query.maxPrice) {
         filteredItems = filteredItems.filter(
             (filteredItems) => filteredItems.price < parseFloat(req.query.maxPrice)
         );
     }
     if (req.query.prefix) {
         filteredItems = fileredItems.filter((i) =>
         i.product.startsWith(req.query.prefix)
         );
     }
     if (req.query.pageSize) {
         filteredItems = filteredItems.slice(0, parseInt(req.query.pageSize));
     }
    //  res.status(200).send(filteredItems);
  }
res.json(filteredItems);
})
})
// cart.get("/", (req, res) => {
  
//   // pool.query("SELECT * FROM shopping_cart;").then( (results) => {
//   //       res.json(results.rows);
//   //       res.status(200);
//   //   })
//   // const maxPrice = req.query.maxPrice;
//   // const prefix = req.query.prefix;
//   // const pageSize = req.query.pageSize;
//   // if (req.query){
//   //   if (req.query.maxPrice){
//   //     pool.query("SELECT * FROM shopping_cart WHERE price < $1;" [req.query.maxPrice]).then( (results) => {
//   //       res.json(results.rows);
//   //       res.status(200);
//   //   })
//   //   }
//   // } else {
//   //   pool.query("SELECT * FROM shopping_cart;").then( (results) => {
//   //     res.json(results.rows);
//   //     res.status(200);
//   // })
//   // }
   
// });

cart.get("/:id", (req, res) => {

 const id = parseInt(req.params.id);
 pool.query("SELECT * FROM shopping_cart WHERE id=$1;", [id]).then( (results) => {
  const items = results.rows;
        if (!items.length) {
            res.status(404).json('Not found');
        } else {
            res.json(items);
        }
})

 
})

// accept POST request at URI: /cart
cart.post('/', (req, res) => {
	// Get item from body
	const newItem = req.body;
	// Add to array
	// routes.push(newItem);
	pool.query('INSERT INTO shopping_cart (product, price, quantity) VALUES ($1, $2, $3);', [
		newItem.product,
		newItem.price,
    newItem.quantity
	]).then( () => {
        res.status(201); // return 201 status code
        res.json(newItem);
    })
});


cart.put("/:id", (req, res) => {
  
  const id = parseInt(req.params.id);
  const item=req.body;
  pool.query('UPDATE shopping_cart SET product=$1, price=$2, quantity=$3 WHERE id=$4 RETURNING *;' , 
  [
		item.product,
    item.price,
		item.quantity,
    id
	]).then( (results) => {
        res.status(201); // return 201 status code
        res.json(results.rows);
    })
});

// accept DELETE request at URI: /cart
cart.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    pool.query("DELETE FROM shopping_cart WHERE id=$1;", [id]).then( (results) => {
      res.json(results.rows);
      res.status(200);
  })
    
  
});

//export module to use in other files
module.exports = cart;
