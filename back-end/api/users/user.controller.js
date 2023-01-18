const {
  get_users_info,
  getUserByUsername,
  active_users_tokens,
  delete_user_token,
  uservehicle,
  operatorstation,
  create_user,
  find_user_by_username,
  update_user,
  check_apikey_username_combo,
  SessionsPerEV_search,
  SessionsPerStation_search,
  SessionsPerProvider_search,
  SessionsPerPoint_search,
  insert_event_to_db
} = require("./user.service");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const csv = require('csv-parser');
var fs = require('fs');

var readFile = require('fs');
var token1;
var tok;


module.exports = {
  get_users: (req, res) => {
    const parameters = req.params;
    if (parameters.username == 'null' ||parameters.username == null ||parameters.username == undefined ||parameters.username == "" ) {// otan dinv sto postman null to metafrazei san string null ('null') giauto ebala to if apo katw
      parameters.username = null;
    }
    if (parameters.username == null) {
      return res.status(400).send('Bad request');
    }
    get_users_info(parameters, (err, results, api) => {
      if (err) {
        //console.log(err);
        return res.status(500).send('Internal server error');
      }
      if (!results) {
        return  res.status(402).send('No data');
      }
      else {
        return res.json({
          data: results,
          apikey: api
        });
      }
    });
  },
    login: (req, res) => {   
      var result = false;
      const body = req.body;
      getUserByUsername(body.username, (err, results) => {
        if (body.username == 'null' ||body.username == null ||body.username == undefined ||body.username == "" ) {
          body.username = null;
      }
      if (body.username == null) {
      return res.status(400).send('Bad request');
      }

      if (body.password == 'null' ||body.password == null ||body.password == undefined ||body.password == "" ) {
          body.password = null;
      }
      if (body.password == null) {
      return res.status(400).send('Bad request');
      }
        const username = body.username;

        if (err) {
          //console.log(err);

          return res.status(500).send('Internal server error');

        }
        if (results) {
          if (body.password == results.password) result = true;
          if (result) {
            //results.password = undefined; // kanonika auto prepei na einai xvriw sxolio
            global.loginfo = results; // sto info pane oi plirofories to xristi poy mpike
            var jsontoken;
            if (results.role == 1) {
                jsontoken = sign({ result: results }, process.env.JWT_KEY_ADMIN, {
                expiresIn: "1h"
              });
            }
            else if (results.role == 2) {
                jsontoken = sign({ result: results }, process.env.JWT_KEY_USER, {
                expiresIn: "1h"
              });
            }
            else if (results.role == 3) {
                jsontoken = sign({ result: results }, process.env.JWT_KEY_OPERATOR, {
                expiresIn: "1h"
              });
            }
            fs.writeFile('../softeng20-21API.token', jsontoken, (err) => {
              // When a request is aborted - the callback is called with an AbortError
               if (err) ;//console.log(err);
               });  
            active_users_tokens(jsontoken,username,(err, results) => {
              if (err) {                                    
                //(err);
                return res.status(500).send('Internal server error');

              }
            });
            token1 = jsontoken;
            res.set('x-observatory-auth', jsontoken);
            return res.json({
              success: 1,
              user: username,
              message: "login successfully",
              token: jsontoken,
              info: results
            });
          }
          else {
            return res.status(401).send('Not authorized');
          }
        }
        else if (!results) {
          return res.status(401).send('Not authorized');
        } 
      });
    },
    logout: (req, res) => {
      var token = req.get("x-observatory-auth"); 
      delete_user_token(token, (err, results) => {
        if (err) {
          //console.log(err);
          return res.status(500).send('Internal server error');
        }
        if (results) {
          return  res.status(402).send('No data');
        }
        fs.access('../softeng20-21API.token', (err) => {
          if (err) {
            //console.error('myfile dosent exists');
            return;
          }
          else if(!err){
            fs.unlink('../softeng20-21API.token', (err) => {
            if (err) console.log(err);
            //console.log('path/file.txt was deleted');
            });
          }
        });
        return res.status(200).send("OK")
      });
    },
    healthcheck: (req, res) => {
      id = 10000;
      uservehicle(id, (err, results) => {
        if (err) {
          //console.log(err);
          return res.status(500).json({
            status: "failed"
          });
        }
        return res.status(200).json({
          status: "OK"
        });
      });
    },

    getUservehicle: (req, res) => {
      const id = loginfo.vehicle_id;
      uservehicle(id, (err, results) => {
        if (err) {
          //console.log(err);
          return res.status(500).send('Internal server error');
        }
        if (!results) {
          return  res.status(402).send('No data');
        }
        return res.status(200).json({
          success: 1,
          data: results
        });
      });
    },
    getoperatorstation: (req, res) => {
      const id = loginfo.station_id;
      operatorstation(id, (err, results) => {
        if (err) {
          //console.log(err);
          return res.status(500).send('Internal server error');
        }
        if (!results) {
          return  res.status(402).send('No data');
        }
        return res.status(200).json({
          success: 1,
          data: results
        });
      });
    },
    insert_user_info: (req, res) => {
      const body = req.body;
      const parameters = req.params;
      // otan dinv sto postman null to metafrazei san string null ('null') giauto ebala ta 2 if apo katw
      if (req.params.station_id === 'null' || parameters.station_id === 'undefined') {
        req.params.station_id = null;
      }
      if (req.params.vehicle_id === 'null' || parameters.vehicle_id === 'undefined') {
        req.params.vehicle_id = null;
      }
      if (req.params.role === 'null' || parameters.role === 'undefined') {
        req.params.role = 1;
      }
      if (parameters.username == 'null' ||parameters.username == null ||parameters.username == undefined ||parameters.username == "" ) {// otan dinv sto postman null to metafrazei san string null ('null') giauto ebala to if apo katw
      parameters.username = null;
    }
    if (parameters.username == null) {
      return res.status(400).send('Bad request');
    }
    if (parameters.password == 'null' ||parameters.password== null ||parameters.password == undefined || parameters.password == "" ) {// otan dinv sto postman null to metafrazei san string null ('null') giauto ebala to if apo katw
    parameters.password = null;
    }
    if (parameters.password == null) {
      return res.status(400).send('Bad request');
    }
      find_user_by_username(parameters, (err, results) => {
        if (err) {
          //console.log(err);
          return res.status(500).send('Internal server error');
        }
        if (!results) { 
          create_user(parameters, (err, results,api) => {
            if(err && err.code == 'ER_DUP_ENTRY'){
              //console.log(err);
              return res.status(500).send('Internal server error');
            }
            else if (err) {
              //console.log(err);
              return res.status(500).send('Internal server error');
            }
            return res.status(200).json({
              success: 1,
              message:"inserted user successfully",
              data: parameters,
              apikey: api
            });
          });
        }
        else{
            update_user(parameters, (err, result) => {
            if (err) {
              //console.log(err);
              return res.status(500).send('Internal server error');
            }
            return res.status(200).json({
              success: 1,
              message: "updated successfully",
              data: parameters,
              apikey: results.apikey
            });
          });
        }
      });  
    },
    resetsessions: (req, res) => {
      req.params.username = "admin";
      req.params.password = "petrol4ever";
      req.params.role = 1;
      const body = req.body;
      const parameters = req.params;
      if(req.params.station_id == 'null') {
        req.params.station_id=null;
      }
      if(req.params.vehicle_id == 'null') {
        req.params.vehicle_id=null;
      }
      find_user_by_username(parameters, (err, results) => {
        if (err) {
          //console.log(err);
          
          return res.status(500).json({
            status: "failed"
          });
        }
        if (!results) { 
          create_user(parameters, (err, results,api) => {
            if(err && err.code == 'ER_DUP_ENTRY'){
              //console.log(err);
              
              return res.status(500).json({
                status: "failed"
              });
            }
            else if (err) {
              //console.log(err);
              
              return res.status(500).json({
                status: "failed"
              });
            }
            return res.status(200).json({
              status: "OK"
            });
          });
        }
        else{
          update_user(parameters, (err, results) => {
          if (err) {
            //console.log(err);
            return res.status(500).json({
              status: "failed"
            });
          }
          return res.json({
            status: "OK"
          });
        });
      }
      });
      
    },




    InserteSession: (req, res) => {
      const body = req.body;
      const parameters = req.params;
      if(req.params.station_id == 'null') {
        req.params.station_id=null;
      }
      if(req.params.vehicle_id == 'null') {
        req.params.vehicle_id=null;
      }
          insert_event_to_db(parameters, (err, results,api) => {
            if(err && err.code == 'ER_DUP_ENTRY'){
              //console.log(err);
              return res.status(500).send('Internal server error');

            }
            else if (err) {
              //console.log(err);
              return res.status(500).send('Internal server error');

            }
            return res.status(200).json({
              success: 1,
              message:"inserted user successfully",
              data: parameters,
              //apikey: api
            });
          });
    },
    check_apikey_username: (req, res) => {
      const body = req.body;
      // otan dinv sto postman null to metafrazei san string null ('null') giauto ebala ta 2 if apo katw

      check_apikey_username_combo(body, (err, results) => {
        if (err) {
          //console.log(err);
          return res.status(500).send('Internal server error');
        }
        if (!results) { 
          return  res.status(402).send('No data');
        }
        else{
          return res.status(200).send("OK"); 
        }
      });
      
    },
    ////////////////////////////////////////////////////////////////////////////
      SessionsFromFile: (req, res) => {
      //const body = req.body;
      // otan dinv sto postman null to metafrazei san string null ('null') giauto ebala ta 2 if apo katw

      var file_err = false;
      const fs = require('fs')
      const csv = require('csv-parser')
     // const randomWords = require('random-words')
      const users = [];
      fs.createReadStream('./uploads/file.csv')
        .pipe(csv())
        .on('data', function (row) {
         
          insert_event_to_db(row, (err, results) => {
        if (err) {
          //file_err = true;
          return; //res.status(500).send('Internal server error');
        }
        if (!results) { 
          
          return;  
        }
      });
        })
        .on('end', function () {
            //console.table(users)
        // TODO: SAVE users data to another file
      })



      fs.access('./uploads/file.csv', (err) => {
        if (err) {
          //console.log(err);
          //console.error('myfile dosent exists');
          return;
        }
        else if(!err){
          fs.unlink('./uploads/file.csv', (err) => {
          if (err) //console.log(err);
          //console.log('path/file.txt was deleted');
          ;
          });
        }
      });

      if (file_err) return res.status(500).send('Internal server error');
      return res.status(200).send("OK")



      
      
    },

/////////////////////////////////////////////////////////////////////////////////////////////

    
    SessionsPerEV: (req, res) => {
      const parameters = req.params;
      const format = req.query.format
      SessionsPerEV_search(parameters, (err, results,total_energy,num_of_sessions,unique_points) => {
        if (err) {
          //console.log(err);
          return res.status(500).send('Internal server error');

        }
        if (!results) { 
          return  res.status(402).send('No data');

        }
        else{
          var current_time = new Date();
          current_time= current_time.toISOString().replace('T', ' ');
          var length = current_time.length;
          current_time = current_time.slice(0,length-5);
          if (format == null || format == "json"){
          return res.status(200).json(
            
              {
                VehicleID: parameters.vehicleID,
                RequestTimestamp: current_time,
                PeriodFrom: parameters.yyyymmdd_from,
                PeriodTo: parameters.yyyymmdd_to,
                TotalEnergyConsumed: total_energy,
                NumberOfVisitedPoints: unique_points,
                NumberOfVehicleChargingSessions:num_of_sessions
              ,
              
                data: results
            }
          );
        }
        else if(format == "csv"){
          var json = 
            {
              VehicleID: parameters.vehicleID,
              RequestTimestamp: current_time,
              PeriodFrom: parameters.yyyymmdd_from,
              PeriodTo: parameters.yyyymmdd_to,
              TotalEnergyConsumed: total_energy,
              NumberOfVisitedPoints: unique_points,
              NumberOfVehicleChargingSessions:num_of_sessions
            ,
            
              data: results
          }
        
        const { Parser, transforms: { unwind }  } = require('json2csv');
          const fields = ['success', 'message','VehicleID','RequestTimestamp','PeriodFrom','PeriodTo','TotalEnergyConsumed','NumberOfVisitedPoints','NumberOfVehicleChargingSessions','data.SessionIndex','data.SessionID','data.EnergyProvider','data.StartedOn','data.FinishedOn','data.ΕnergyDelivered','data.PricePolicyRef','data.CostPerKWh','data.SessionCost'];
          const transforms = [unwind({ paths: ['data'], blankOut: true })];
          
          const json2csvParser = new Parser({ fields, transforms });
          const csv = json2csvParser.parse(json);
          
          
          res.set('Content-Type', 'text/csv');
          return res.status(200).send(csv);
        
        } 
        }
      });
      
    },
    SessionsPerStation: (req, res) => {
      const parameters1 = req.params;
      const format = req.query.format
      SessionsPerStation_search(parameters1, (err, results1,operator,total_energy,num_of_rows,unique_points) => {
        if (err) {
          //console.log(err);
          return res.status(500).send('Internal server error');

        }
        if (!results1) {
          return  res.status(402).send('No data');

        }
        else{
          var current_time = new Date();
          current_time= current_time.toISOString().replace('T', ' ');
          var length = current_time.length;
          current_time = current_time.slice(0,length-5);
          
          if (format == null || format == "json"){
          return res.status(200).json(
            
              {
            StationID: parameters1.stationID,
            Operator: operator,
            RequestTimestamp: current_time,
            PeriodFrom: parameters1.yyyymmdd_from,
            PeriodTo: parameters1.yyyymmdd_to,
            TotalEnergyConsumed: total_energy,
            NumberOfChargingSessions: num_of_rows,
            NumberOfActivePoints: unique_points
              ,
              
            

            
            data: results1
            }
          
          );
        }
        else if(format == "csv"){
          var json = [
            {
          StationID: parameters1.stationID,
          Operator: operator,
          RequestTimestamp: current_time,
          PeriodFrom: parameters1.yyyymmdd_from,
          PeriodTo: parameters1.yyyymmdd_to,
          TotalEnergyConsumed: total_energy,
          NumberOfChargingSessions: num_of_rows,
          NumberOfActivePoints: unique_points
            },
            {
          

          
          data: results1
          }
        ]

          const { Parser, transforms: { unwind }  } = require('json2csv');
          const fields = ['success', 'message','StationID','Operator','RequestTimestamp','PeriodFrom','PeriodTo','TotalEnergyConsumed','NumberOfChargingSessions','NumberOfActivePoints','data.PointID','data.PointSessions','data.EnergyDelivered'];
          const transforms = [unwind({ paths: ['data'], blankOut: true })];
          
          const json2csvParser = new Parser({ fields, transforms });
          const csv = json2csvParser.parse(json);
          
          res.set('Content-Type', 'text/csv');
          return res.status(200).send(csv);
        } 
        }
      });
      
    },
    SessionsPerProvider: (req, res) => {
      const parameters = req.params;
      const format = req.query.format
      SessionsPerProvider_search(parameters, (err, results,operator,total_energy,num_of_rows,unique_points) => {
        if (err) {
          //console.log(err);
          return res.status(500).send('Internal server error');

        }
        if (!results || !results[0] ) {
          return  res.status(402).send('No data');

        }
        else{
          for(i=0; i<results.length; i++){
            
            var dtlength = results[i].StartedOn.toISOString().length;
            results[i].StartedOn = results[i].StartedOn.toISOString().replace('T', ' ').slice(0,dtlength-5);
  
            var dtlength = results[i].FinishedOn.toISOString().length;
            results[i].FinishedOn = results[i].FinishedOn.toISOString().replace('T', ' ').slice(0,dtlength-5); 

          }
          if (format == null || format == "json"){
              
          return res.json(
          
            {
              
            data: results
          }
          
          );
        }
        else if(format == "csv"){
          var json = [
            {
            data: results
          }
          ]
          
          const { Parser, transforms: { unwind }  } = require('json2csv');
          const fields = ['success', 'message', 'data.ProviderID','data.ProviderName', 'data.StationID','data.SessionID','data.VehicleID','data.StartedOn','data.FinishedOn','data.EnergyDelivered','data.PricePolicyRef','data.CostPerKWh','data.TotalCost'];
          const transforms = [unwind({ paths: ['data'], blankOut: true })];
          
          const json2csvParser = new Parser({ fields, transforms });
          const csv = json2csvParser.parse(json);
          
                    
          res.set('Content-Type', 'text/csv');
          return res.status(200).send(csv);

        }
        }
      });
      
    },
    
    SessionsPerPoint: (req, res) => {
      const parameters = req.params;
      const format = req.query.format
      SessionsPerPoint_search(parameters, (err, results,operator,total_energy,num_of_rows,unique_points) => {
        if (err) {
          //console.log(err);
          return res.status(500).send('Internal server error');

        }
        if (!results || !results[0]) { 
          
          return  res.status(402).send('No data');

        }
        else{
          point_index =1;
          var res_length  = results.length;
          var point_op = results[0].PointOperator;
          var point_id = results[0].Point;
          for (i=0; i<res_length; i++){
            results[i].SessionIndex = point_index;
            point_index += 1;
            results[i].Point = undefined;
            results[i].PointOperator = undefined;
            
            var dtlength = results[i].StartedOn.toISOString().length;
            results[i].StartedOn = results[i].StartedOn.toISOString().replace('T', ' ').slice(0,dtlength-5);
  
            var dtlength = results[i].FinishedOn.toISOString().length;
            results[i].FinishedOn = results[i].FinishedOn.toISOString().replace('T', ' ').slice(0,dtlength-5); 

          }

          



          var current_time = new Date();
          current_time= current_time.toISOString().replace('T', ' ');
          var length = current_time.length;
          current_time = current_time.slice(0,length-5);
          if (format == null || format == "json"){
          return res.json(
            
              {
                Point: point_id,
                PointOperator: point_op,  
                RequestTimestamp:current_time,
                PeriodFrom: parameters.yyyymmdd_from,
                PeriodTo: parameters.yyyymmdd_to,
                NumberOfChargingSessions: res_length
            ,
            
                data: results
            }
          
          );
        }
        else if (format == "csv"){
          var json = [
            {
              Point: point_id,
              PointOperator: point_op,  
              RequestTimestamp:current_time,
              PeriodFrom: parameters.yyyymmdd_from,
              PeriodTo: parameters.yyyymmdd_to,
              NumberOfChargingSessions: res_length
          },
          {
              data: results
          }
        ]
          
          const { Parser, transforms: { unwind }  } = require('json2csv');
          const fields = ['success', 'message','Point','PointOperator', 'RequestTimestamp','PeriodFrom','PeriodTo','NumberOfChargingSessions','data.SessionIndex','data.SessionID','data.StartedOn','data.FinishedOn','data.EnergyDelivered'];
          const transforms = [unwind({ paths: ['data'], blankOut: true })];
          
          const json2csvParser = new Parser({ fields, transforms });
          const csv = json2csvParser.parse(json);
          
          res.set('Content-Type', 'text/csv');
          return res.status(200).send(csv);


        }
          
        }
      });
      
    },
};