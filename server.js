const express = require("express");
//imports the students route
const cart = require('./cart');


// creates an instance of an Express server - always called app in the server file
const app = express();
//allow us to suse query param strings, pat param and boty in req object
app.use(express.json());
// define the port
const port = 3000;

//when go to students should render info in students file

app.use("/cart/" , cart);


// run the server
app.listen(port, () => console.log(`Listening on port: ${port}.`));

console.log("http://localhost:" + port + "/cart");