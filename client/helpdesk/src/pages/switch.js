import React, { useContext, useState } from 'react';
import '../components/login.css';
import UserService from '../authentication/user.service';

export default function Switch({ socket }) {
    var originalAgent = "";
    var targetAgent = "";
    var customer = ""

    const setAgentName = (value) => {
        targetAgent = value
    }

    const setClientName = (value) => {
        customer = value
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        originalAgent = sessionStorage.getItem("userName");
        UserService.assignCustomerToAgent(originalAgent, targetAgent, customer).then(
            () => {
                socket.emit("customerReassigned", {originalAgent, targetAgent, customer});
                alert ("Switch performed successfully");
            },
            error => {
                alert("Agent offline or customer doesn't exist! Please try again.");
            }
        );     
    };


    const renderHandOffForm = (

        <>
            <div className='login-page-title'>Client Hand Off Form</div>
            <div className='login-form'>
                <form onSubmit={handleSubmit}>
                    <div className='input-fields'>
                        <label>Destination Agent Name</label>
                        <input type='text' name='targetAgent' onChange={(e) => setAgentName(e.target.value)} required />
                    </div>
                    <div className='input-fields'>
                        <label>Client Name</label>
                        <input type='text' name='customer' onChange={(e) => setClientName(e.target.value)} required />
                    </div>
                    <div className='submit-button'>
                        <input type="submit" />
                    </div>
                </form>
            </div>
        </>

    );

    return (
        <div className='page'>
            <div className='login-page'>
                <div>
                    {renderHandOffForm}
                </div>
            </div>
        </div>

    );
}
