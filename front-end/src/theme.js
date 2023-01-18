import { MuiThemeProvider, makeStyles, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
      background: {
        default: "#303030"
      },
      primary: {
          main: "#4BB000"
      },
      secondary: {
          main: "#303030"
      }
    },
    spacing: 8,
    typography: {
		fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
     }
			
	});
  
export default theme;
