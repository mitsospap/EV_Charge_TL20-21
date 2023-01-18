const router = require("express").Router();
const { 
  checkToken_user,
  checkToken_admin,
  checkToken_operator,
  checkToken_all,
  checkToken_admin_user,
  checkToken_admin_operator
 } = require("../../auth/token_validation");
const {
  login,
  get_users,
  logout,
  getUservehicle,
  getoperatorstation,
  insert_user_info,
  check_apikey_username,
  SessionsPerEV,
  SessionsPerStation,
  SessionsPerProvider,
  SessionsPerPoint,
  InserteSession,
  SessionsFromFile,
  healthcheck,
  resetsessions
} = require("./user.controller");
const {
  deleteEvents
} = require("./user.service");

var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
//var PORT = process.env.PORT || 3000;

var storage = multer.diskStorage(
  {
      destination: './uploads/',
      filename: function ( req, file, cb ) {
          //req.body is empty...
          //How could I get the new_file_name property sent from client here?
          cb( null, "file.csv");
      }
  }
);
var upload = multer({ storage: storage })


// use of body parser
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(cors());




router.post("/login", login);
router.post("/apikey", check_apikey_username);
router.get("/admin/users/:username",checkToken_admin, get_users); // blepei olous tous users se mia alli basi, melontika ua afere8ei einai monio gia test          
router.get("/usercar", checkToken_user, getUservehicle); //blepei ta stoixia tou id tou user poy ekane log in
router.get("/operator", checkToken_operator, getoperatorstation); //blepei ta stoixia tou stattion tou operator pou ekane login
router.post("/logout", checkToken_all, logout); // diagrafei to token apo lista allowed users
router.post("/admin/usermod/:username/:password/:vehicle_id/:role/:station_id", checkToken_admin, insert_user_info)


//-------------
router.get("/SessionsPerEV/:vehicleID/:yyyymmdd_from/:yyyymmdd_to",checkToken_admin_user, SessionsPerEV); //blepei ta stoixia tou id tou user poy ekane log in
router.get("/SessionsPerStation/:stationID/:yyyymmdd_from/:yyyymmdd_to",checkToken_admin_operator, SessionsPerStation); //blepei ta stoixia tou id tou user poy ekane log in
router.get("/SessionsPerProvider/:providerID/:yyyymmdd_from/:yyyymmdd_to",checkToken_admin, SessionsPerProvider);
router.get("/SessionsPerPoint/:pointID/:yyyymmdd_from/:yyyymmdd_to",checkToken_admin, SessionsPerPoint);
//----------

router.post("/InserteSession/:provider_id/:station_id/:point_id/:vehicle_id/:energy/:cost/:program_id/:connect_time/:disconnect_time/:username",checkToken_admin_user,InserteSession);



router.get("/admin/healthcheck",healthcheck);
router.post("/admin/resetsessions",deleteEvents,resetsessions);

//----- apo edw kai katw einai gia tin eisgvgh olokliroy csv arxeioy poy paei ston fakelo uploads----//
//gia tin epejergasia toy csv arxeioy des 
//--------------------------------------------------------------------------------------------------------//fnjiehnvjhiqerfhiebfguiedfuioberfeb
router.post("/admin/system/sessionsupd", upload.single('file'),SessionsFromFile);
//------------------------------------------------------------------------------//



module.exports = router;