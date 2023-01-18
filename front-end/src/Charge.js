import React, {Component} from 'react'
import './App.scss';
import Container from '@material-ui/core/Container';
import "./login.css";
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import theme from './theme.js';
import APIKit from './shared/APIKit.js'
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    input: {
        root: {
        backgroundColor: 'white',
        color: 'white',
    }},
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      color: theme.palette.secondary.main,
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    box: {
        color: theme.palette.primary.main
    },
    cssLabel: {
        color : 'green'
    },
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
        borderColor: `${theme.palette.primary.main} !important`,}
    },
    cssFocused: {},
    notchedOutline: {
        borderWidth: '1px',
        borderColor: 'green !important'
    },   
    padding: theme.spacing(2),
    TextField: {
        color: 'red'
    }
  }));

class Charge extends Component {
    constructor(props){
        super(props);
        this.state = {
            initBtn: false
        };
    }

    handleInit = event => {
        this.setState({initBtn: true});

    }

    render () {
        return (
        <MuiThemeProvider theme={theme}>
        <Container component="main" theme={theme} maxWidth="xs" spacing={5}>
            <CssBaseline />
        <Button variant="contained" color="primary" onClick={this.handleInit}>Click Here to initiate Charging Sequence!</Button>
        {this.state.initBtn && <ChargeForm />}
        </Container>
        </MuiThemeProvider>
        
        )
    }

}
var role = localStorage.getItem('roleID')
var temp = 0
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function timestamp(d){
    function pad(n) {return n<10 ? "0"+n : n}
    var dash="-"
    var colon=":"
    return d.getFullYear()+dash+
    pad(d.getMonth()+1)+dash+
    pad(d.getDate())+" "+
    pad(d.getHours())+colon+
    pad(d.getMinutes())+colon+
    pad(d.getSeconds())
  }


class ChargeForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            vehicleid: '',
            providerid: '',
            stationid: '',
            pointid: '',
            programid: '',
            energy: '',

        };
    }
    
    if (role=1) {var vehicleid = localStorage.getItem('vehicleID')}   

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    
    handleSubmit = event => {
        if (this.state.programid === 1){
            temp = 1.2
        }
        else if (this.state.programid === 2){
            temp = 1.5
        }
        else {
            temp = 2
        }
        var cost = this.state.energy * temp
        var username = localStorage.getItem('username')
        var connect_time = timestamp(new Date());
        var disconnect_time = new Date();
        disconnect_time = addMinutes(disconnect_time, 20);
        disconnect_time = timestamp(disconnect_time);

        var vehicleid = this.state.vehicleid;
        username = this.state.username;

        if (role===2){
            vehicleid = localStorage.getItem('vehicleID')
            username = localStorage.getItem('username')

        }

        event.preventDefault();

        const onFailure = error => {
            console.log("Failure")
        };
        const config = {
            headers: {
              "x-observatory-auth": localStorage.getItem('token'),
            }
          }
        APIKit      
		.post("/InserteSession/"+this.state.providerid+"/"+this.state.stationid+"/"+this.state.pointid+"/"+vehicleid+"/"+this.state.energy+"/"+cost+"/"+this.state.programid+"/"+connect_time+"/"+disconnect_time+"/"+username, {data: null},config)
		.then(res => {
             console.log(res.data)
            })      
		.catch(onFailure);
    }

    render() {
        return (
            
            <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                <br></br>
                <Grid container direction={"column"} spacing={5}>
                <Grid item >
                <TextField id="username" label="Username" name="username" variant="outlined" onChange = {this.handleChange}/>
                </Grid>
                <Grid item>
                <TextField id="vehicleid" label="Vehicle ID" name="vehicleid" variant="outlined" onChange = {this.handleChange}/>
                </Grid>
                <Grid item>
                <TextField id="providerid" label="Provider ID" name="providerid" variant="outlined" onChange = {this.handleChange}/>
                </Grid>
                <Grid item>
                <TextField id="stationid" label="Station ID" name="stationid" variant="outlined" onChange = {this.handleChange}/>
                </Grid>
                <Grid item>
                <TextField id="pointid" label="Point ID" name="pointid" variant="outlined" onChange = {this.handleChange}/>
                </Grid>
                <Grid item>
                <TextField id="programid" label="Program ID" name="programid" variant="outlined" onChange = {this.handleChange}/>
                </Grid>
                <Grid item>
                <TextField id="energy" label="Desired KWh" name="energy" variant="outlined" onChange = {this.handleChange}/>
                </Grid>
                <Grid>
                    <Button type="submit" variant="contained" color="primary">Submit</Button>
                </Grid>
            </Grid>
          </form>
          
          
        )
    }
}

const ChargeFunc = () => {
    const classes = useStyles();
    return (
        <div>
        <Charge classes={classes} />
        </div>
    )
};

export default ChargeFunc;
