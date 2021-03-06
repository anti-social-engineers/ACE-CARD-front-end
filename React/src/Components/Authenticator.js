import React, { Component } from 'react';
import axios from 'axios';
import config from '../config/config';
import socketIOClient from "socket.io-client";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt from 'jsonwebtoken';
import { Redirect } from 'react-router-dom';

export const myContext = React.createContext();

class Authenticator extends Component {

    state = {
        data: [],
        hasConnected: false
    }
    
    async componentDidMount() {
        const auth_token = localStorage.getItem('jwt token')
        const header = 'Bearer ' + auth_token;
        const res = await axios.get(config.API_URL+'api/account', {headers: {Authorization:header}});
        var user = res.data;
        if (res.data.has_card) {
            const blob = await axios.get(config.API_URL + res.data.image, {headers: {Authorization:header}, responseType: "blob"});
            
            user["image"] = URL.createObjectURL(blob.data);
            
            this.initSocketConnection();
        }
        var decoded = jwt.verify(localStorage.getItem('jwt token'), config.signature);
        user["attributes"] = decoded;

        this.setState({
            data: {user}
        });
    
    }
    
    initSocketConnection = () => {
        const io = socketIOClient(config.REDIS_URL, { query: {jwt: localStorage.getItem('jwt token')} , forceNew: true});
            console.log("IO:", io);
            io.on("connection", socket => {
                console.log("HAS CONNECTED");
                socket.emit("jwt", localStorage.getItem('jwt token'));
            });

            io.on("init", data => {
                var curr_data = Object.assign({}, this.state.data);
                curr_data["notifications"] = data.map(notification => {
                    notification.amount = parseFloat(notification.amount);
                    notification.updated_balance = parseFloat(notification.updated_balance);
                    return notification;
                });

                this.setState({data: curr_data });
            });

            io.on("event", data => {
                if (data !== this.state.notifications) {
                    var curr_data = Object.assign({}, this.state.data);

                    if (data[0]){
                        // Als er tussen nu en 5 seconden geleden een deposit binnen komt krijgt de gebruiker een toast notificatie
                        if (((new Date()) - new Date(data[0].datetime)) < 5000) {
                            if (data[0].name === "deposit") {
                                toast.success("Uw transactie is geslaagd! U heeft zojuist € " + parseFloat(data[0].amount).toFixed(2) + " opgewaardeerd!");
                                curr_data.hasJustReceivedDeposit = true;
                                setTimeout(() => {
                                    curr_data.hasJustReceivedDeposit = false;
                                }, 5000);
                            }
                        } else {
                            curr_data.hasJustReceivedDeposit = false;
                        }
                        curr_data.user.previous_credits = curr_data.user.credits;

                        if ((data[0].name === "deposit" || data[0].name === "transaction")) {
                            curr_data.user.credits = parseFloat(data[0].updated_balance).toFixed(2);   
                        }
                    }

                    curr_data["notifications"] = data.map(notification => {
                        notification.amount = parseFloat(notification.amount);
                        notification.updated_balance = parseFloat(notification.updated_balance);
                        return notification;
                    });

                    this.setState({data: curr_data });

                }
            });

            io.on("reconnect", () => {
                io.emit("jwt", localStorage.getItem('jwt token'));
            })
        }

    render() {
        return (
            <>
                <myContext.Provider value={{ ...this.state }}>
                    {this.props.children}
                </myContext.Provider>
            </>
        )
    }
}


export default Authenticator;