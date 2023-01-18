const jwt = require("jsonwebtoken");
const {
  search_token
} = require("../api/users/user.service");
module.exports = {
  checkToken_user: (req, res, next) => {
    var token = req.get("x-observatory-auth"); 
    if (token == undefined){
      return res.status(400).send('Bad request');
      }
    search_token(token, (err, results) => {
      if (err) {
       //console.log(err);
        return res.status(500).send('Internal server error');
      }
      if (!results) {
        return res.status(401).send('Not authorized');
        
      }
    if (token) {
      jwt.verify(token, process.env.JWT_KEY_USER, (err, decoded) => {
        if (err) {
          return res.status(401).send('Not authorized');
        } else {
          req.decoded = decoded;
          next();
        }
      });
      
    } 
    else {
      return res.status(401).send('Not authorized');
      }
    });
  },


  //--------------------------------------------------------------------------------------------------//
  checkToken_admin: (req, res, next) => {
    var token = req.get("x-observatory-auth"); 
    if (token == undefined){
      return res.status(400).send('Bad request');
      }
    search_token(token, (err, results) => {
      if (err) {
        //console.log(err);
        return res.status(500).send('Internal server error');
      }
      if (!results) {
        return res.status(401).send('Not authorized');
        
      }
    
    if (token) {
      jwt.verify(token, process.env.JWT_KEY_ADMIN, (err, decoded) => {
        if (err) {
          return res.status(401).send('Not authorized');
        } else {
          req.decoded = decoded;
          next();
        }
      });
      
    } 
    else {
      return res.status(401).send('Not authorized');
      }
    });
  },
  checkToken_operator: (req, res, next) => {
  var  token = req.get("x-observatory-auth");    
    if (token == undefined){
      return res.status(400).send('Bad request');
          }
    search_token(token, (err, results) => {
      if (err) {
        //console.log(err);
        return res.status(500).send('Internal server error');
      }
      if (!results) {
        return res.status(401).send('Not authorized');
      }
    if (token) {
      jwt.verify(token, process.env.JWT_KEY_OPERATOR, (err, decoded) => {
        if (err) {
          return res.status(401).send('Not authorized');
        } else {
          req.decoded = decoded;
          next();
        }
      });
      
    } 
    else {
      return res.status(401).send('Not authorized');
      }
    });
  },
  checkToken_all: (req, res, next) => {
    var token = req.get("x-observatory-auth"); 
    var bool = true;
    if (token == undefined){
      return res.status(400).send('Bad request');
          }
    search_token(token, (err, results) => {
      if (err) {
        //console.log(err);
        return res.status(500).send('Internal server error');
      }
      if (!results) {
        return res.status(401).send('Not authorized');
      }
    if (token) {
      jwt.verify(token, process.env.JWT_KEY_ADMIN, (err, decoded) => {
        if (err) {
        } else {
          req.decoded = decoded;
          bool = false;
          next();
        }
      });
      if(bool){
      jwt.verify(token, process.env.JWT_KEY_USER, (err, decoded) => {
        if (err) {
        } else {
          req.decoded = decoded;
          bool = false;
          next();
        }
      });
      }
      if(bool){
      jwt.verify(token, process.env.JWT_KEY_OPERATOR, (err, decoded) => {
        if (err) {
          return res.status(401).send('Not authorized');
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
    } 
    else {
      return res.status(401).send('Not authorized');
      }
    });
  },
  checkToken_admin_user: (req, res, next) => {
    var token = req.get("x-observatory-auth");
    var bool = true; 
    if (token == undefined){
      return res.status(400).send('Bad request');
          }
    search_token(token, (err, results) => {
      if (err) {
        //console.log(err);
        return res.status(500).send('Internal server error');
      }
      if (!results) {
        return res.status(401).send('Not authorized');
      }
    if (token &&    (  (results.vehicle_id == req.params.vehicleID || results.vehicle_id == null) || ((results.vehicle_id == req.params.vehicle_id || results.vehicle_id == null) && results.username == req.params.username ) )) {
      jwt.verify(token, process.env.JWT_KEY_ADMIN, (err, decoded) => {
        if (err) {
        } else {
          req.decoded = decoded;
          bool = false;
          next();
        }
      });
      if(bool){
      jwt.verify(token, process.env.JWT_KEY_USER, (err, decoded) => {
        if (err) {
          return res.status(401).send('Not authorized');
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
    } 
    else {
      return res.status(401).send('Not authorized');
      }
    });
  },
  checkToken_admin_operator: (req, res, next) => {
    var token = req.get("x-observatory-auth"); 
    var bool = true;
    if (token == undefined){
      return res.status(400).send('Bad request');
          }
    search_token(token, (err, results) => {
      if (err) {
        //console.log(err);
        return res.status(500).send('Internal server error');
      }
      if (!results) {
        return res.status(401).send('Not authorized');
      }
    if (token && (results.vehicle_id == req.params.stationID || results.stationID == null)) {
      jwt.verify(token, process.env.JWT_KEY_ADMIN, (err, decoded) => {
        if (err) {
        } else {
          req.decoded = decoded;
          bool = false;
          next();
        }
      });
      if(bool){
      jwt.verify(token, process.env.JWT_KEY_OPERATOR, (err, decoded) => {
        if (err) {
          return res.status(401).send('Not authorized');
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
    } 
    else {
      return res.status(401).send('Not authorized');
      }
    });
  }

};