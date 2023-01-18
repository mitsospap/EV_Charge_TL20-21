import React, {Component} from 'react'
import logo from './logo.svg';
import './App.scss';
import axios from 'axios';
import reactDOM from 'react-dom';


const api = axios.create({
	baseURL: 'http://localhost:4000/api/users'
})

class App1 extends Component {
    state = {
        name: ''

    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        const user = {
          name: this.state.name
        }
        axios.post('https://jsonplaceholder.typicode.com/users', { user })
          .then(res=>{
            console.log(res);
            console.log(res.data);
            window.location = "/retrieve" //This line of code will redirect you once the submission is succeed
          })
      }
    
    render () {
        
        return (
        
            <Container>
            <Header/>
                <form onSubmit = { this.handleSubmit }>
                    <label> Email:
                        <input type = "text" name = "name" onChange= {this.handleChange}/>
                    </label>
                    
                    <button type = "submit"> Add </button>
                </form>
            </Container>
        );

    }
	
  }


export default App;
