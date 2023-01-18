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
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from 'axios';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import EvStation from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import {data, $} from 'jquery';
import { CsvToHtmlTable } from 'react-csv-to-table'; 
import APIKit, {setClientToken} from './shared/APIKit.js'
import App from './App'


const drawerWidth = 240;

const username = `Username; Identifier;First name;Last name
booker12;9012;Rachel;Booker
grey07;2070;Laura;Grey
johnson81;4081;Craig;Johnson
jenkins46;9346;Mary;Jenkins
smith79;5079;Jamie;Smith
`;

const arrayj = 
  `[{
  "name":"John",
  "age":30,
  "cars":[ "Ford", "BMW", "Fiat" ]
  },
  {
  "name":"Tom",
  "age":27,
  "cars":[ "Honda", "BMW", "Fiat" ]
  } ]`
;

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




function Dashboard(props) {
  const classes = useStyles();
  const [users, setUsers] = useState('');
  const [open, setOpen] = React.useState(true);
  var userList = JSON.stringify(users, null, 4);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    /*localStorage.removeItem('token');
    props.history.push('/login');*/

    const onSuccess = ({data}) => {
      console.log("Success")
      // Set JSON Web Token on success
      console.log(data)
      localStorage.removeItem('token');
      props.history.push('/login');
    };

    const onFailure = error => {
      console.log("Failure")
    };

  const handleLogout = () => {    
    const config = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "x-observatory-auth": localStorage.getItem('token'),
      }
    }

  APIKit      
  .post("/logout", {data: null}, config)
  .then(res => {

    onSuccess(res);
    //
        
        })      
  .catch(onFailure);
  }

  const handleGetUsers = event => {
    APIKit      
		.get("/users/", { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`} })      
		.then(res => {
             console.log(res);
             setUsers(res.data);
             
              data = JSON.parse(JSON.stringify(res.data.data))

              if (data.length > 0 ){
               var temp = "";
               
               //--start for loop
                data.forEach((u) => {
                  temp += "<tr>";
                  temp += "<td>"+u.id+"</td>";
                  temp += "<td>"+u.firstName+"</td>";
                  temp += "<td>"+u.lastName+"</td>";
                  temp += "<td>"+u.number+"</td>"+"</tr>";
                })
               //--close for loop
              }
               document.getElementById("data").innerHTML = temp;
               
            })      
		.catch(err => console.log(err));
  }

  const handleUserCar = event => {

    const token1 = localStorage.getItem('token')
    const roleid1 = localStorage.getItem('roleid')

    const config = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "x-observatory-auth": token1,
      }
    }
    if (roleid1==1){
      var temp = "You are an admin!"
      document.getElementById("UserCar").innerHTML = temp;
    }
    else if (roleid1==2){
    APIKit      
		.get("/usercar", config)      
		.then(res => {            
      console.log(res.data)
      var temp = JSON.stringify(res.data.data)
      document.getElementById("UserCar").innerHTML = temp;
      })      
		.catch(err => console.log(err));
    }
    else {
    APIKit      
		.get("/operator", config)      
		.then(res => {            
      console.log(res.data)
      var temp = JSON.stringify(res.data.data)
      document.getElementById("UserCar").innerHTML = temp;
      })      
		.catch(err => console.log(err));

    }


    

    
  }

  function getCsv() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  } 

  const handlearrayj = event => {
    var data1 = JSON.parse(arrayj);

    if (data1.length > 0 ){
      var temp = "";
      console.log("json array");
      //--start for loop
      data1.forEach((u) => {
        temp += "<tr>";
        temp += "<td>"+u.name+"</td>";
        temp += "<td>"+u.age+"</td>";
        temp += "<td>"+u.cars+"</td>"+"</tr>";
      })
      //--close for loop
    }
      document.getElementById("data1").innerHTML = temp;

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
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Get my Vehicle Data" onClick={handleUserCar}/>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Get CSV" onClick={getCsv}/>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Get JSON Array" onClick={handlearrayj}/>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="UserCar" onClick={handleUserCar}/>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LayersIcon />
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
               <table>
                <thead id ="data">
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Number</th>
                  </tr>
                </thead>
                <tbody id="data">
                </tbody>
              </table>
              </Paper> 
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
              <tbody id="UserCar">
                </tbody>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              
              <Paper className={classes.paper}>
              <class id="myDIV">
              <CsvToHtmlTable
                data={username}
                csvDelimiter=";"
                class="csvtable"
              />
              </class>

              </Paper>
              
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

export default Dashboard;