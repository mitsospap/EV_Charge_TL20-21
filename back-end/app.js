require("dotenv").config();
const express = require("express");

const bodyParser = require('body-parser');

const cors = require('cors');



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const userRouter = require("./api/users/user.router");



// my code
app.use("/evcharge/api",express.static("./frontend/public"));
// my code

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-OBSERVATORY-AUTH");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
let pain;
app.use(express.json());

app.use("/evcharge/api", userRouter);



const port = process.env.PORT || 8765;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
 });

//  const myMod = require("./cli");
// myMod.clim();
app.get("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 

app.post("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 

app.put("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 

app.patch("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 

app.delete("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 

app.copy("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 

app.head("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 

app.options("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 

app.link("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 

app.unlink("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 

app.purge("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 

app.lock("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 

app.unlock("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 

app.propfind("*", (req, res) => { 
  // Here user can also design an 
  // error page and render it  
  res.status(400).send("Bad request"); 
 
}); 