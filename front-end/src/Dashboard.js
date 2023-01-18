import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import EvStation from '@material-ui/icons/EvStation';
import DateRange from '@material-ui/icons/DateRange';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import APIKit from './shared/APIKit.js'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
      width: "100%",
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  myDIV: {
    display: 'none',
    visibility: 'hidden',
  }
}));

var vehicleID = "0"
var stationID = "0"


function Dashboard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [datefrom, setDatefrom] = useState('');
  const [dateto, setDateto] = useState('');
  const token1 = localStorage.getItem('token')
  const role = localStorage.getItem('roleID')

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const onSuccess = ({data}) => {
      localStorage.removeItem('token');
      localStorage.removeItem('vehicleID');
      localStorage.removeItem('roleID');
      localStorage.removeItem('stationID');
      props.history.push('/login');
    };

    const onFailure = error => {
      console.log("Failure")
    };

  const handleLogout = () => {    
    const config = {
      headers: {
        "x-observatory-auth": localStorage.getItem('token'),
      }
    }

  APIKit      
  .post("/logout", {data: null}, config)
  .then(res => {

    onSuccess(res);
    
        
        })      
  .catch(onFailure);
  }

  const handleChange1 = event => {
    setDatefrom(event.target.value)
  };

  const handleChange2 = event => {
    setDateto(event.target.value)
  };

  const handleData = event => {

    const config = {
      headers: {
        "x-observatory-auth": token1,
      }
    }
    if (role==1){
      var temp = "You are an admin!"
      document.getElementById("Data").innerHTML = temp;
    }
    else if (role==2){
    
    APIKit      
		.get("/usercar", config)      
		.then(res => {    
      var data = (res.data.data)
      var temp = "";
      temp += "<tr>"; 
      temp += "<td><b>Vehicle ID: </b>"+data.vehicle_id+", </td>";
      temp += "<td><b>Year: </b>"+data.year+", </td>";
      temp += "<td><b>Model: </b>"+data.model+", </td>";
      temp += "<td><b>Brand: </b>"+data.brand+", </td>"+"</tr>";

      document.getElementById("Data").innerHTML = temp;

      })      

		.catch(err => console.log(err));
    }
    else {
    APIKit      
		.get("/operator", config)      
		.then(res => {            
      var data = (res.data.data)
      var temp = "";
      temp += "<tr>"; 
      temp += "<td><b>Station ID: </b>"+data.station_id+",</td>";
      temp += "<td><b>Number of Points: </b>"+data.num_of_points+",</td>";
      temp += "<td><b>Provider ID: </b>"+data.provider_id+"</td>"+",</tr>";

      document.getElementById("Data").innerHTML = temp;
      })      
		.catch(err => console.log(err));

    }
    
  }

    
  let yyyymmdd_from = '2000-01-01'
  let yyyymmdd_to = '2020-01-01'

  const handleSessions = event => {
    vehicleID = "0"
    const role = localStorage.getItem('roleID')
    if (role==1){
      vehicleID = "0"
    }
    if (role==2){
      const config = {
        headers: {
          "x-observatory-auth": token1,
        }
      }

      APIKit      
      .get("/usercar", config)      
      .then(res => {            
        vehicleID = JSON.stringify(res.data.data.vehicle_id);
        })      
      .catch(err => console.log(err));
      
    }
    
  }

  const handleDates = event => {
    event.preventDefault();
    yyyymmdd_from = datefrom
    yyyymmdd_to = dateto 
    const config = {
      headers: {
        "x-observatory-auth": token1,
      }
    }
    if (role==1){
      vehicleID = "0"
      APIKit      
      .get("/SessionsPerEV/"+vehicleID+"/"+yyyymmdd_from+"/"+yyyymmdd_to, config)      
      .then(res => {            
        var data = (res.data)
        var temp = "";
        temp += "<tr>";
        temp += "<td><b>Time: </b>"+data.RequestTimestamp+", </td>";
        temp += "<td><b>Period From: </b>"+data.PeriodFrom+", </td>";
        temp += "<td><b>Period To: </b>"+data.PeriodTo+", </td>";
        temp += "<td><b>Total Energy Consumed: </b>"+data.TotalEnergyConsumed+", </td>";
        temp += "<td><b>Number of Visited Points: </b>"+data.NumberOfVisitedPoints+", </td>";
        temp += "<td><b>Number of Vehicle Charging Sessions: </b>"+data.NumberOfVehicleChargingSessions+" </td>";

        if (data.data.length > 0 ){
          
          //--start for loop
           data.data.forEach((u) => {
             temp += "<tr>";
             temp += "<td><b>Session Index: </b>"+u.SessionIndex+"</td>";
             temp += "<td><b>Session ID: </b>"+u.SessionID+"</td>";
             temp += "<td><b>Energy Provider: </b>"+u.EnergyProvider+"</td>";
             temp += "<td><b>Started On: </b>"+u.StartedOn+"</td>";
             temp += "<td><b>Finished On: </b>"+u.FinishedOn+"</td>";
             temp += "<td><b>Energy Delivered: </b>"+u.ΕnergyDelivered+"</td>";
             temp += "<td><b>Price Policy Ref: </b>"+u.PricePolicyRef+"</td>";
             temp += "<td><b>Cost Per KWh: </b>"+u.CostPerKWh+"</td>";
             temp += "<td><b>Session Cost: </b>"+u.SessionCost+"</td>"+"</tr>";
           })
          //--close for loop
         }



        document.getElementById("Sessions").innerHTML = temp;
        })      
      .catch(err => console.log(err));
    }
    if (role==2) {
      vehicleID = localStorage.getItem('vehicleID')
      APIKit      
      .get("/SessionsPerEV/"+vehicleID+"/"+yyyymmdd_from+"/"+yyyymmdd_to, config)      
      .then(res => {            
        var data = (res.data)
        var temp = "";
        temp += "<tr>";
        temp += "<td><b>Time: </b>"+data.RequestTimestamp+", </td>";
        temp += "<td><b>Period From: </b>"+data.PeriodFrom+", </td>";
        temp += "<td><b>Period To: </b>"+data.PeriodTo+", </td>";
        temp += "<td><b>Total Energy Consumed: </b>"+data.TotalEnergyConsumed+", </td>";
        temp += "<td><b>Number of Visited Points: </b>"+data.NumberOfVisitedPoints+", </td>";
        temp += "<td><b>Number of Vehicle Charging Sessions: </b>"+data.NumberOfVehicleChargingSessions+" </td>";

        if (data.data.length > 0 ){
          
        //--start for loop
        data.data.forEach((u) => {
          temp += "<tr>";
          temp += "<td><b>Session Index: </b>"+u.SessionIndex+"</td>";
          temp += "<td><b>Session ID: </b>"+u.SessionID+"</td>";
          temp += "<td><b>Energy Provider: </b>"+u.EnergyProvider+"</td>";
          temp += "<td><b>Started On: </b>"+u.StartedOn+"</td>";
          temp += "<td><b>Finished On: </b>"+u.FinishedOn+"</td>";
          temp += "<td><b>Energy Delivered: </b>"+u.ΕnergyDelivered+"</td>";
          temp += "<td><b>Price Policy Ref: </b>"+u.PricePolicyRef+"</td>";
          temp += "<td><b>Cost Per KWh: </b>"+u.CostPerKWh+"</td>";
          temp += "<td><b>Session Cost: </b>"+u.SessionCost+"</td>"+"</tr>";
        })
      }

        document.getElementById("Sessions").innerHTML = temp;
        })      
      .catch(err => console.log(err));
    }
    if (role==3){
      stationID = localStorage.getItem('stationID')
      APIKit      
      .get("/SessionsPerStation/"+stationID+"/"+yyyymmdd_from+"/"+yyyymmdd_to, config)      
      .then(res => {            
        var data = (res.data)
        var temp = "";
        temp += "<tr>";
        temp += "<td><b>Station ID: </b>"+data.StationID+", </td>";
        temp += "<td><b>Operator: </b>"+data.Operator+", </td>";
        temp += "<td><b>Time: </b>"+data.RequestTimestamp+", </td>";
        temp += "<td><b>Period From: </b>"+data.PeriodFrom+", </td>";
        temp += "<td><b>Period To: </b>"+data.PeriodTo+", </td>";
        temp += "<td><b>Total Energy Consumed: </b>"+data.TotalEnergyConsumed+", </td>";
        temp += "<td><b>Number Of Charging Sessions: </b>"+data.NumberOfChargingSessions+", </td>";
        temp += "<td><b>Number Of Active Points: </b>"+data.NumberOfActivePoints+" </td>"+"</tr>";
        
        if (data.data.length > 0 ){

        //--start for loop
        data.data.forEach((u) => {
          temp += "<tr>";
          temp += "<td><b>Point ID: </b>"+u.PointID+"</td>";
          temp += "<td><b>Point Sessions: </b>"+u.PointSessions+"</td>";
          temp += "<td><b>Energy Delivered: </b>"+u.EnergyDelivered+"</td>"+"</tr>";
        })

        }
        
        document.getElementById("Sessions").innerHTML = temp;
        })      
      .catch(err => console.log(err));

    }


  }

  const handleCharge = event => {
    window.location = "http://localhost:5000/charge"
  }

  return (
 
    <div className={classes.root}>
    
      <CssBaseline />
      
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)} maxWidth="lg">
        <Container maxWidth="lg">
        <Toolbar className={classes.toolbar} >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            ChargerMan App
          </Typography>
          <div className={classes.exitbtn}>
          <IconButton onClick={handleLogout}>
            <ExitToAppIcon/>
          </IconButton>
          </div>
        </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <div>
    <ListItem button>
      <ListItemIcon>
        <PermIdentityIcon />
      </ListItemIcon>
      <ListItemText primary="Get my Data" onClick={handleData}/>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DateRange />
      </ListItemIcon>
      <ListItemText primary="Get my Sessions" onClick={handleSessions}/>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <EvStation />
      </ListItemIcon>
      <ListItemText primary="Charge your Car" onClick={handleCharge}/>
    </ListItem>
  </div>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
     
            <Grid item xs={12} md={8} lg={9}>
              <Paper label="Users" className={fixedHeightPaper}>
              <thead id ="Data">
                </thead>
              <table>
                <tbody id="Data">
                </tbody>
              </table>
              </Paper> 
            </Grid>

            <Grid item xs={12}>
              
              <Paper className={classes.paper}>
              <form onSubmit={handleDates}>
                <TextField 
                  name="datefrom" 
                  label="Date From"
                  onChange = {handleChange1}
                  format="YYYYMMDD"
                  required />

                <TextField 
                  name="dateto" 
                  label="Date To"
                  onChange = {handleChange2}
                  format="YYYYMMDD"
                  required />
                <br></br>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"                       
                >
                    Get Sessions
                </Button>
                  

              </form>

              <table>
                <thead id ="Sessions">
                  
                </thead>
                <tbody id="Sessions">
                </tbody>
              </table>
              </Paper>
              
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}


export default Dashboard;
