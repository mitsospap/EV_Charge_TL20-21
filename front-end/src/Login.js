import React, {Component} from 'react'
import './App.scss';
import { Container } from '@material-ui/core';
import "./login.css";
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import logo from './chargerman.png'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import theme from './theme.js';
import APIKit from './shared/APIKit.js'

  const useStyles = makeStyles((theme) => ({
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
  }));

const initialState = {
    username: '',
    password: '',
    errors: {},
    isAuthorized: false,
    roleid: '',
  };



class Login extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    state = initialState;

    location = this.props.location;

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = event => {

        const onSuccess = ({data}) => {          
            // Set JSON Web Token on success
            //setClientToken(data.token);
            if (data.token)
            {
            this.setState({isAuthorized: true, roleid: data.info.role});
            localStorage.setItem('token', data.token);
            localStorage.setItem('roleID', data.info.role)
            localStorage.setItem('username', data.info.username)}
            if (data.info.role===2) localStorage.setItem('vehicleID', data.info.vehicle_id)
            if (data.info.role===3) localStorage.setItem('stationID', data.info.station_id)
          };

        const onFailure = error => {
            console.log("Failure")
        };

        event.preventDefault();
        const params = new URLSearchParams()
        params.append('username', this.state.username)
        params.append('password', this.state.password)

        const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }

        APIKit      
		.post("/login", params, config)
		.then(res => {
             onSuccess(res);
            })      
		.catch(onFailure);

        
    }

    render() {
        const classes = this.props.classes;
        return(
        <MuiThemeProvider theme={theme}>
        <Container component="main" theme={theme} maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <img src={logo} alt="ChargerMan Logo" ></img>
                <Typography component="h1" variant="h5" color="primary">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
                {this.state.isAuthorized && <h1>Welcome!</h1>}
                {!this.state.isAuthorized && <h1>Please Login!</h1>}
                    <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    onChange = {this.handleChange}
                    autoFocus   
                    fullWidth  
                    InputProps={{
                        classes: {
                            root: classes.cssOutlinedInput,
                            focused: classes.cssFocused,
                            notchedOutline: classes.notchedOutline,
                        },
                        inputMode: "numeric"
                    }} 
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange = {this.handleChange}
                        fullWidth
                        InputProps={{
                            classes: {
                                root: classes.cssOutlinedInput,
                                focused: classes.cssFocused,
                                notchedOutline: classes.notchedOutline,
                            },
                            inputMode: "numeric"
                        }} 
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"                       
                    >
                        Sign In
                    </Button>
                </form>
            </div>

        </Container>
        </MuiThemeProvider>
        )
    }
}

const LoginFunc = () => {
    const classes = useStyles();
    return (
        <div>
        <Login classes={classes} />
        </div>
    )
};

export default LoginFunc;
