import React, {Component} from 'react';
import './App.css';
import Nav from './Components/Navbar';
import Home from './Components/Home';
import Register  from './Components/Register';
import Account from './Components/Account';
import Saldo from './Components/Saldo';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import RegisterStep2 from './Components/RegisterStep2';
import Confirm from './Components/Confirm';
import {ProtectedRoute} from './protected.route'

class App extends Component {
  render() {
    return (

      <React.Fragment>
      <Router>     
      
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/Register" component={Register} />
            <ProtectedRoute path="/Account" component={Account}/>
            <ProtectedRoute path="/Saldo" component={Saldo}/>
            <Route path="/Confirm/:id" component={Confirm} />
            <ProtectedRoute
             path="/Register2" component={RegisterStep2} 
             />

          </Switch>
        </Router>

      </React.Fragment>
      
    ); 

  }
}

export default App;
