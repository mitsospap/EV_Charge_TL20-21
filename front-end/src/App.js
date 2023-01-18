import React from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Login from './Login';
import Home from './Home';
import './App.scss';
import theme from './theme.js';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Dashboard from './Dashboard';
import PrivateRoute from './shared/PrivateRoute';
import PublicRoute from './shared/PublicRoute';
import Charge from './Charge';

 
function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
    <div className="App">
      <BrowserRouter>
        <div>
          <div className="header">
            <NavLink exact activeClassName="active" to="/">Home</NavLink>
            <NavLink activeClassName="active" to="/login">Login</NavLink><small>(Access without token only)</small>
            <NavLink activeClassName="active" to="/dashboard">Dashboard</NavLink><small>(Access with token only)</small>
            <NavLink activeClassName="active" to="/charge">Charge</NavLink>
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <PublicRoute path="/login" component={Login} />
              <PrivateRoute path="/dashboard" component={Dashboard} exact />
              <PrivateRoute path="/charge" component={Charge} exact />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
    </MuiThemeProvider>
    
  );
}
 
export default App;
