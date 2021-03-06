import React, { Component } from 'react'
import PasswordStrengthMeter from '../../Tools/PasswordStrengthMeter';
import config from '../../../config/config'
import axios from 'axios'

class RegisterForm extends Component {

    constructor(props){
      super(props);
      this.passwordRepeatRef = React.createRef()
      this.createAcc = this.createAcc.bind(this)
    }

    state = {
        email: "",
        password: "",
        repeat_password: "",
        account: {email: "", password: ""},
        submission_status: "none",
        loading: false,
        form_submit_count: 0,
        form_error: "",
        hasSubmitted: false,
        message:''
    }

    form_errors = {
        PASSWORD_MISMATCH: "Uw herhaalwachtwoord komt niet overeen met uw wachtwoord",
        INVALID_EMAIL: "Uw email is incorrect.",
        ACCOUNT_EXISTS: "De opgegeven email is al in gebruik.",
        TOO_MANY_TRIES: "U heeft het formulier te vaak gestuurd. Probeer nog eens over " + this.props.timeout / 60000 + " minuten."
    }

    handleChange = (e) => {
      this.setState({
        [e.target.id]: e.target.value 
      })
    }    
    
    handlePasswordChange = (e) => {
      this.setState({
        [e.target.id]: e.target.value 
      })
    }

    createAcc(account){
      console.log(account)

    }  
  


    isValidForm = () => {

        if (this.state.form_submit_count >= 5) {

            this.setState({form_error: this.form_errors.TOO_MANY_TRIES});
            setTimeout(function (){
                this.setState({form_submit_count: 0}, () => console.log(this.state.form_error));
            }.bind(this), this.props.timeout);

            return false;
        } else {
            this.setState({form_submit_count: this.state.form_submit_count + 1});
        }

        if (this.state.password !== this.state.repeat_password) {
            this.setState({form_error: this.form_errors.PASSWORD_MISMATCH});
            return false;
        }
        return true;
    }

    handleSubmit = (e) => {
        this.setState({hasSubmitted: true});
        if (!this.isValidForm()) {
          return;
        }
        
        if (this.state.submission_status === "success") {
            this.setState({loading:false, submission_status: "none"});
            return false;
        }

        console.log("Actually submitting");
        this.setState({account:{email: this.state.email, password: this.state.password}, loading:true});
        var logininfo = document.getElementsByClassName("login-info")[0];
  
        if (logininfo.classList.contains("animated")){
           logininfo.classList.remove("animated", "shake");
        }
        
        setTimeout(function(){
            // this is a placeholder for server side validation
            axios.post(config.API_URL+'/api/register', this.state.account)
            .then(res => {
              this.setState({form_error:'', submission_status: "success"})
            })
            .catch(err => {
              if(err == 'Error: Request failed with status code 409'){
                this.setState({submission_status: "wrong", loading: false, form_error:'Het gegeven email adres bestaat al!' });
              }
              if(err == 'Error: Request failed with status code 422'){
                this.setState({ submission_status: "wrong", loading: false, form_error: 'Wachtwoord is niet lang genoeg! (minimaal 8 karakters)' });
              }
              if(err == 'Error: Request failed with status code 500'){
                this.setState({ submission_status: "wrong", loading: false, form_error: 'Er is iets fout met de server. Excuses voor het ongemak!'});
              }}
              )
        }.bind(this), 400);
     }

    getResult = (result) => {
      console.log(result);
      this.setState({hasSubmitted: false});
    }
    

    render() {
        return (
            <div className="outerform">
              <div className="form-wrapper">
                <div className="form-title">
                  <h2>Registreren</h2>
                </div>
                <div className="login-info">
                     <span className={this.state.form_error ? "loading-text loading-text--small" : "d-none invis"}><i className="fas fa-exclamation-circle"></i>{this.state.form_error}</span>
                </div>
                  <div className={this.state.loading ? "form-loader" : "d-none form-loader--hidden"}>
                        <span className={this.state.submission_status !== "success" ? "loading-text loading-text--small" : "d-none invis"}><i className="fas fa-circle-notch fa-spin"></i>Email valideren...</span>
                        <span className={this.state.submission_status === "success" ? "loading-text loading-text--small" : "d-none invis"}><i className="fas fa-check"></i>Een email is zojuist gestuurd naar: {this.state.email}</span>
                </div>
                  <div className="form-content">
                   <div className={this.state.loading ? "d-none" : "inputs inputs-space"}>
                        <div className="group">
                            <input type="email" id="email" ref="email" onChange={this.handleChange} required />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>E-mail</label>
                        </div>
                        <div className={this.state.password.length > 0 ? "group pb-4" : "group"}>      
                            <input autoComplete="off" id="password" type="password" onChange={this.handlePasswordChange} required />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <PasswordStrengthMeter hasSubmitted={this.state.hasSubmitted} getResult={this.getResult} password={this.state.password} />
                            <label>Wachtwoord</label>
                        </div>
    
                      <div className="group">      
                        <input type="password" id="repeat_password" onChange={this.handlePasswordChange} required />
                          <span className="highlight"></span>
                          <span className="bar"></span>
                          {this.state.repeat_password && this.state.repeat_password !== this.state.password && <span className="form-helper">Wachtwoord komt niet overeen met herhaal wachtwoord.</span>}
                          <label>Wachtwoord herhalen</label>
                        </div>
                     </div> 
                  </div>
                 

                  </div>
                    {(this.state.submission_status === "none" || this.state.submission_status === "wrong") && <button className="main-button main-button--margin float-right"><span className="main-button-action">Registreren</span></button>}
                  </div>
        );
    }

}

export default RegisterForm
