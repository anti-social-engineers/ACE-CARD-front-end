import React, { Component } from 'react'
import '../Styles/css/bootstrap-theme.css'
import '../Styles/css/bootstrap-theme.min.css'
import '../Styles/css/bootstrap.css'
import '../Styles/css/bootstrap.min.css'
import '../Styles/css/style.css'
import {connect} from 'react-redux'
import {createAcc} from '../Helper/actions/authorizationAction'
import RegisterForm from './Form/Home/RegisterForm'
import axios from 'axios'

class Register extends Component {
  constructor(props) {
    super(props);
    this.registerform = React.createRef();
  }
  state = {
    email:'',
    password:'',
    repeatpassword:''
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.registerform.current.handleSubmit();
    // console.log(this.registerform.current.state.account);
    // this.props.createAcc(this.registerform.current.state.account);
  }

  createAcc(account){
    console.log(account)
    axios.post('http://api.aceofclubs.nl/api/register', account)
    .then(res => {
      console.log('test' + res)
    })
    .then(err => {
      console.log('error sending request'+"["+ err +"]")
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="content-wrapper">
          <div className="cont">
            <div className="row no-gutters">
                <div className="card-area col-sm-12 col-md-12 col-lg-12 col-xl-7">
                  <div className="textarea">
                    <h3>Account aanmaken</h3>
                    <p>lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum</p>
                  </div>
                  <img src={require('../Styles/img/cardbox.png')} alt="" className="acecard" />
                </div>
                <div className="formarea col-sm-12 col-md-12 col-lg-12 col-xl-5">
                  <RegisterForm createAcc={this.createAcc} timeout={300000} ref={this.registerform}/>
                </div>
              </div>
          </div>    
        </div>
      </form>
                
    )
  }
}

const ObjToProps = (object) => {
  return {
    createAcc: (account) => object(createAcc(account))
  }
}

export default connect(null, ObjToProps)(Register)
