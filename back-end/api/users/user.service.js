const pool = require("../../config/database");
const pool_test = require("../../config/database_test");

function getRandomText(length) {
  var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789".match(/./g);
  var text = "";
  var result;
  for (var i = 0; i < length; i++) text += charset[Math.floor(Math.random() * charset.length)];
  text += '-';
  for (var i = 0; i < length; i++) text += charset[Math.floor(Math.random() * charset.length)];
  text += '-';
  for (var i = 0; i < length; i++) text += charset[Math.floor(Math.random() * charset.length)];
  return text;
  
}
 function num_of_points(parameters, callback) {
   if (parameters.vehicleID > 0) {
  pool.query(
    `select *,COUNT(distinct(point_id)) as sum_of_points from events where vehicle_id = ? and connect_time >= ? and  connect_time <= ? order by connect_time`,
    [
      parameters.vehicleID,
      parameters.yyyymmdd_from,
      parameters.yyyymmdd_to
    ],
    (error, results, fields) => {
      if (error) {
        //console.log(error);
        return callback(error);
      }
      if (!results[0].sum_of_points) {
        //console.log(results)
        return callback(null, undefined)
      } else {
        unique_points = results[0].sum_of_points;
      }
      return callback(null, results[0])
    },
  )
}
  else {
    pool.query(
      `select *,COUNT(distinct(point_id)) as sum_of_points from events where  connect_time >= ? and  connect_time <= ? order by connect_time`,
      [
        parameters.yyyymmdd_from,
        parameters.yyyymmdd_to
      ],
      (error, results, fields) => {
        if (error) {
          //console.log(error);
          return callback(error);
        }
        if (!results[0].sum_of_points) {
          
          return callback(null, undefined)
        } else {
          unique_points = results[0].sum_of_points;
        }
        return callback(null, results[0])
      },
    )
  }
}
//-------------------------------//
function num_of_points_station(parameters4,callback) {
  if (parameters4.stationID>0){
    pool.query(
   `(SELECT 
    null as unique_points,null as point_id_cal,null as energy_per_point,null as point_freq,us.username,e.station_id,e.energy,e.point_id,null as num_of_rows,null as energy_sum,e.connect_time    FROM events e
    inner join programs pr on pr.program_id = e.program_id
    inner join users us on us.station_id = e.station_id 
    where e.station_id = ? and connect_time >= ? and  connect_time <= ?)
    UNION all
     (select 
      COUNT(distinct(point_id)) as sum_of_points,null,null,null,null,null,null,null,count(username),sum(energy) , connect_time 
     from events where station_id = ? and connect_time >= ? and  connect_time <= ? )
     union all
     (SELECT 
      null,point_id,null, COUNT(point_id) AS freq ,null,null,null,null,null,null,connect_time 
     FROM events where station_id = ? and connect_time >= ? and  connect_time <= ?  GROUP BY point_id)
     union all
     (SELECT 
      null,point_id, sum(energy) AS enrgy_per_point ,null,null,null,null,null,null,null,connect_time 
     FROM events where station_id = ? and connect_time >= ? and  connect_time <= ?  GROUP BY point_id)
     
    order by unique_points`,
   [
     parameters4.stationID,
     parameters4.yyyymmdd_from,
     parameters4.yyyymmdd_to,
     parameters4.stationID,
     parameters4.yyyymmdd_from,
     parameters4.yyyymmdd_to,
     parameters4.stationID,
     parameters4.yyyymmdd_from,
     parameters4.yyyymmdd_to,
     parameters4.stationID,
     parameters4.yyyymmdd_from,
     parameters4.yyyymmdd_to
   ],
   (error, results7, fields) => {
     if (error) {
       //console.log(error);
       return callback(error);
     }
     if(!results7[0] || results7[0].unique_points == 0 ){
       return callback(null,undefined)
     }else{
      return callback(null,results7);
       }
    },
 )}
 else if (parameters4.stationID == 0){
   pool.query(
    `(SELECT 
     null as unique_points,null as point_id_cal,null as energy_per_point,null as point_freq,us.username,e.station_id,e.energy,e.point_id,null as num_of_rows,null as energy_sum,e.connect_time    FROM events e
     inner join programs pr on pr.program_id = e.program_id
     inner join users us on us.station_id = e.station_id 
     where  connect_time >= ? and  connect_time <= ?)
     UNION all
      (select 
       COUNT(distinct(point_id)) as sum_of_points,null,null,null,null,null,null,null,count(username),sum(energy) , connect_time 
      from events where  connect_time >= ? and  connect_time <= ? )
      union all
      (SELECT 
       null,point_id,null, COUNT(point_id) AS freq ,null,null,null,null,null,null,connect_time 
      FROM events where  connect_time >= ? and  connect_time <= ?  GROUP BY point_id)
      union all
      (SELECT 
       null,point_id, sum(energy) AS enrgy_per_point ,null,null,null,null,null,null,null,connect_time 
      FROM events where  connect_time >= ? and  connect_time <= ?  GROUP BY point_id)
      
     order by unique_points`,
    [
      parameters4.yyyymmdd_from,
      parameters4.yyyymmdd_to,
      parameters4.yyyymmdd_from,
      parameters4.yyyymmdd_to,
      parameters4.yyyymmdd_from,
      parameters4.yyyymmdd_to,
      parameters4.yyyymmdd_from,
      parameters4.yyyymmdd_to
    ],
    (error, results8, fields) => {
      if (error) {
        //console.log(error);
        return callback(error);
      }
      if(!results8[0]){
        return callback(null,undefined)
      }else{
       return callback(null,results8);
        }
     },
   )
 }
 else{
  return callback(null,undefined);
 }
}
//------------------------------//
module.exports = {
  get_users_info: (params, callBack) => {
    pool.query(
      `select username, password, vehicle_id, role, station_id, apikey from users where username=?`,
      [params.username],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        if (!results[0]) {
          return callBack(null, results[0], 0);
        }
        var api = results[0].apikey;
        if (api == null) api = undefined;
        results[0].apikey = undefined;
         callBack(null, results[0], api);
      }
    );
  },
  getUserByUsername: (username, callBack) => {
    pool.query(
      `select * from users where username = ?`,
      [username],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
         callBack(null, results[0]);
      }
    );
  },
  delete_user_token: (token, callBack) => {
    pool.query(
      `delete from allowed_users where token = ?`,
      [token],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
         callBack(null, results[0]);
      }
    );
  },
  deleteEvents: (token, callBack,next) => {
    pool.query(
      `delete from events`,
      [],
      (error, results, fields) => {
        if (error) {
          //console.log(error);
          
        }
        next();
      }
    );
  },
  active_users_tokens: (token,username, callBack) => {
    pool.query(
      `insert into allowed_users (token,username) 
                values(?,?)`,
      [
        token,
        username
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
         callBack(null, results);
      }
    );
  },
  search_token: (token, callBack) => {
    pool.query(
      `select al.token,al.username,us.vehicle_id
      from allowed_users al
      inner join users us on us.username = al.username
      where al.token = ?`,
      [token],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
         callBack(null, results[0]);
      }
    );
  },
  uservehicle: (id, callBack) => {
    pool.query(
      `select * from vehicles where vehicle_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
         callBack(null, results[0]);
      }
    );
  },
  operatorstation: (id, callBack) => {
    pool.query(
      `select * from stations where station_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
         callBack(null, results[0]);
      }
    );
  },
  create_user: (params, callBack, api) => {
    var apikey = getRandomText(4);
    pool.query(
      `insert into users(username, password, vehicle_id, role, station_id,apikey) 
                values(?,?,?,?,?,?)`,
      [
        params.username,
        params.password,
        params.vehicle_id,
        params.role,
        params.station_id,
        apikey
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
         callBack(null, results, apikey);
      }
    );
  },
  insert_event_to_db: (params, callBack,api) => {
    
    pool.query(
      `insert into events(provider_id,station_id,point_id,vehicle_id,energy,cost,program_id,connect_time,disconnect_time,username) 
                values(?,?,?,?,?,?,?,?,?,?)`,
      [
        params.provider_id,
        params.station_id,
        params.point_id,
        params.vehicle_id,
        params.energy,
        params.cost,
        params.program_id,
        params.connect_time,
        params.disconnect_time,
        params.username,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
         callBack(null, results);
      }
    );
  },
  find_user_by_username: (params, callBack) => {
    pool.query(
      `select username, apikey from users where username = ?`,
      [params.username],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
         callBack(null, results[0]);
      }
    );
  },
  update_user: (params, callBack) => {
    pool.query(
      `update users set password=?, vehicle_id=?, role=?, station_id=? where username = ?`,
      [
        params.password,
        params.vehicle_id,
        params.role,
        params.station_id,
        params.username
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
         callBack(null, results[0]);
      }
    );
  },
  check_apikey_username_combo: (body, callBack) => {
    pool.query(
      `select username from users where username = ? and apikey = ?`,
      [
        body.username,
        body.apikey
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
         callBack(null, results[0]);
      }
    );
  },
  SessionsPerEV_search: (parameters, callBack) => {

    var unique_points = 0;
    
    num_of_points(parameters,(err,result) =>{
      if (result == undefined || err != null ){
        return callBack(undefined,undefined);
      }
      else if (result != undefined && parameters.vehicleID >0){
      unique_points = result.sum_of_points;
      pool.query(
        `SELECT e.point_id as SessionIndex,e.event_id as SessionID,p.name as EnergyProvider , e.connect_time as StartedOn, e.disconnect_time as FinishedOn , e.energy as ΕnergyDelivered,pr.name as PricePolicyRef,pr.rate as CostPerKWh        , e.cost   as SessionCost 
        FROM events e
                inner join providers p on p.provider_id = e.provider_id
                inner join programs pr on pr.program_id = e.program_id
         where vehicle_id = ? and connect_time >= ? and  connect_time <= ? 
         order by connect_time`
         
        
        ,
         [
          parameters.vehicleID,
          parameters.yyyymmdd_from,
          parameters.yyyymmdd_to
        ],
        (error, results, fields) => {
          if (error) {
            return callBack(error);
          }
          var total_energy = 0;
          var num_of_sessions =0
          var SessionIndex =1;
          for( i in results){
            var length = results[i].StartedOn.toISOString().length;
            results[i].StartedOn = results[i].StartedOn.toISOString().replace('T', ' ').slice(0,length-5);
  
            var length = results[i].FinishedOn.toISOString().length;
            results[i].FinishedOn = results[i].FinishedOn.toISOString().replace('T', ' ').slice(0,length-5);          
                      
            results[i].SessionIndex= SessionIndex; // session index
            SessionIndex +=1;
            
            total_energy += results[i].ΕnergyDelivered
            results[i].vehicle_id= undefined;
            
            num_of_sessions += 1
          }
          return callBack(null, results,total_energy,num_of_sessions,unique_points);
        }
      )  
    }
    else if(parameters.vehicleID == 0 ){
      unique_points = result.sum_of_points;
      pool.query(
        `SELECT e.point_id as SessionIndex,e.event_id as SessionID,p.name as EnergyProvider , e.connect_time as StartedOn, e.disconnect_time as FinishedOn , e.energy as ΕnergyDelivered,pr.name as PricePolicyRef,pr.rate as CostPerKWh        , e.cost   as SessionCost 
        FROM events e
                inner join providers p on p.provider_id = e.provider_id
                inner join programs pr on pr.program_id = e.program_id
         where  connect_time >= ? and  connect_time <= ? 
         order by connect_time`
         
        
        ,
         [
          parameters.yyyymmdd_from,
          parameters.yyyymmdd_to
        ],
        (error, results, fields) => {
          if (error) {
            return callBack(error);
          }
          var total_energy = 0;
          var num_of_sessions =0
          var SessionIndex =1;
          for( i in results){
            var length = results[i].StartedOn.toISOString().length;
            results[i].StartedOn = results[i].StartedOn.toISOString().replace('T', ' ').slice(0,length-5);
  
            var length = results[i].FinishedOn.toISOString().length;
            results[i].FinishedOn = results[i].FinishedOn.toISOString().replace('T', ' ').slice(0,length-5);          
          
            results[i].SessionIndex= SessionIndex; // session index
            SessionIndex +=1;
            
            total_energy += results[i].ΕnergyDelivered
            results[i].vehicle_id= undefined;
            
            num_of_sessions += 1
          }
          return callBack(null, results,total_energy,num_of_sessions,unique_points);
        }
      ) 
    }
    else{
      return  callBack(null, null);

    } 
    })
         
  },
  SessionsPerStation_search: (parameters3, callBack) => {
    

    num_of_points_station(parameters3,(err,results2) =>{
      if (results2 == undefined || err != null ){
        return callBack(undefined,undefined);
      }
     var length = results2.length
     var operator = results2[0].username;
      var energy_sum = results2[length-1].energy_sum;
      var unique_points = results2[length-1].unique_points;
      var num_of_rows = results2[length-1].num_of_rows;
  let points =  new Array;
  for (l = num_of_rows; l < length-1; l++) {
    
    if (results2[l].point_id_cal != null && (points[results2[l].point_id_cal] == null || points[results2[l].point_id_cal] == undefined  )){
      points[results2[l].point_id_cal] = {PointID:results2[l].point_id_cal,PointSessions:null,EnergyDelivered:null};
    }
    
      if (results2[l].point_id_cal != null && (points[results2[l].point_id_cal] != null || points[results2[l].point_id_cal] != undefined  )){
        if(results2[l].energy_per_point != null) points[results2[l].point_id_cal].EnergyDelivered=results2[l].energy_per_point;
        else if(results2[l].point_freq != null) {
          points[results2[l].point_id_cal].PointSessions=results2[l].point_freq;
        }
       
      }
  }
  for (i=0; i< points.length; i++){
    while(points[i] == undefined || points[i] == null){
      points.splice(i, 1);
    }
  }
  return callBack(null,points,operator,energy_sum,num_of_rows,unique_points);
    })
  },

  SessionsPerProvider_search: (parameters, callBack) => {
    
    
    
    if (parameters.providerID>0){
    pool.query(
      `SELECT e.provider_id as ProviderID,prov.name as ProviderName,e.station_id as StationID,e.event_id as SessionID,e.vehicle_id as VehicleID,e.connect_time as StartedOn,e.disconnect_time as FinishedOn,e.energy as EnergyDelivered,pr.name as PricePolicyRef,pr.rate as CostPerKWh ,e.cost as TotalCost
      FROM events e
              inner join programs pr on pr.program_id = e.program_id
              inner join users us on us.station_id = e.station_id 
              inner join providers prov on prov.provider_id=e.provider_id
              where e.provider_id = ? and connect_time >= ? and  connect_time <= ? 
              order by connect_time`,
      [
        parameters.providerID,
        parameters.yyyymmdd_from,
        parameters.yyyymmdd_to
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
         callBack(null, results);
      }
    );}

    else if (parameters.providerID == 0){
      pool.query(
        `SELECT e.provider_id as ProviderID,prov.name as ProviderName,e.station_id as StationID,e.event_id as SessionID,e.vehicle_id as VehicleID,e.connect_time as StartedOn,e.disconnect_time as FinishedOn,e.energy as EnergyDelivered,pr.name as PricePolicyRef,pr.rate as CostPerKWh ,e.cost as TotalCost
      FROM events e
              inner join programs pr on pr.program_id = e.program_id
              inner join users us on us.station_id = e.station_id 
              inner join providers prov on prov.provider_id=e.provider_id
              where connect_time >= ? and  connect_time <= ? 
              order by connect_time`,
        [
          parameters.yyyymmdd_from,
          parameters.yyyymmdd_to
        ],
        (error, results, fields) => {
          if (error) {
            return callBack(error);
          }
           callBack(null, results);
        }
      );
    }
    else{
      return  callBack(null, null);
    }
  },
  SessionsPerPoint_search: (parameters, callBack) => {
    
    
    
    if (parameters.pointID>0){
    pool.query(
      `SELECT null as SessionIndex,e.point_id as Point ,us.username as PointOperator,e.event_id as SessionID,e.connect_time as  StartedOn,e.disconnect_time as FinishedOn, e.energy as EnergyDelivered
      FROM events e
          inner join users us on us.station_id=e.station_id
          where e.point_id = ? and connect_time >= ? and  connect_time <= ? 
          order by connect_time`,
      [
        parameters.pointID,
        parameters.yyyymmdd_from,
        parameters.yyyymmdd_to
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
         callBack(null, results);
      }
    );}

    else if (parameters.pointID == 0){
      pool.query(
        `SELECT null as SessionIndex,e.point_id as Point ,us.username as PointOperator,e.event_id as SessionID,e.connect_time as  StartedOn,e.disconnect_time as FinishedOn, e.energy as EnergyDelivered
        FROM events e
                inner join users us on us.station_id=e.station_id
                where connect_time >= ? and  connect_time <= ? 
                order by connect_time`,
        [
          parameters.yyyymmdd_from,
          parameters.yyyymmdd_to
        ],
        (error, results, fields) => {
          if (error) {
            return callBack(error);
          }
           callBack(null, results);
        }
      );
    }
    else{
      return  callBack(null, null);
    }
  },


};