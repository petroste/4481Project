import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../authContext';
import '../components/login.css';
import roles from '../enums';
import AuthService from "../authentication/auth.service";

export default function Switch({ socket }) {
    const navigate = useNavigate();
    var originalAgent = ""
    var clientName = ""

    const setAgentName = (value) => {
        originalAgent = value
    }

    const setClientName = (value) => {
        clientName = value
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //Handle Switch
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
                        <input type='text' name='originalAgent' onChange={(e) => setClientName(e.target.value)} required />
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
