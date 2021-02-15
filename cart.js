const express = require("express");
const cart = express.Router();

//logic for endpoints
const cartList = [
  { id: 1, product: "Bleeperblorp", price: 100, quantity: 2 },
  { id: 2, product: "Cat scratcher", price: 10, quantity: 30 },
  { id: 3, product: "Whiskey sauce", price: 100000000, quantity: 1 },
  { id: 4, product: "Extra long phone cord", price: 3, quantity: 42 },
];

cart.get("/", (req, res) => {
  const maxPrice = req.query.maxPrice;
  const prefix = req.query.prefix;
  const pageSize = req.query.pageSize;
  let items =cartList;


  if (maxPrice) { 
    items = cartList.filter( (item) => {
        return item.price <= maxPrice;
    });
    res.json(items);
  } 
//else if(prefix){
//     items = cartList.filter( (item) => {
//         return item.price <= maxPrice;
//     }); 
//   }
  else if(pageSize){
    if (pageSize < cartList.length+1){
       // return 
    }
  }
  else {
    // res.status(404);
    // res.json("Not found");
  }
  // res.status(200);
 // console.log(items);
  res.json(items);
});

cart.get("/:id", (req, res) => {

 const id = parseInt(req.params.id);
  //console.log("id is "+ id);

  const things = cartList.find( (thing) => {
    if (thing.id === id){
        //console.log(`this is thing: ${thing}`)
        return thing;
    } else {
       res.status(404).send('ID not found');
    }
})

res.json(things);

});

// accept POST request at URI: /cart
cart.post("/", (req, res) => {
    const newItem = req.body;
    console.log(newItem);
    
    cartList.push(newItem);
    
    res.status(201); // return 201 status code
    res.json(cartList) // return changed list
});


cart.put("/:id", (req, res) => {
  
  const id = parseInt(req.params.id);
  const index = cartList.findIndex((i) => i.id === id);
  console.log(index);
  const item = cartList[index];
  item.price= req.body.price;
  item.quantity = req.body.quantity;
  item.product = req.body.product;

  res.status(200);
  res.json(cartList);

  res.json("Updating the cart item..");
});

// accept DELETE request at URI: /cart
cart.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = cartList.findIndex( (item) => {
        return item.id === id;
    })

    cartList.splice(index, 1);
    res.status(204);
    //console.log(cartList);
    res.json(cartList);
  
});

//export module to use in other files
module.exports = cart;
