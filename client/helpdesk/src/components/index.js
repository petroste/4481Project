import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Nav,
	NavLink,
	Bars,
	NavMenu,
	NavBtn,
	NavBtnLink,
} from './navbar';
import authContext from '../authContext';
import socket from '../sockets/index';
import './welcomeMsg.css';

export default function Navbar() {
	const navigate = useNavigate();
	const { authenticated, setAuthenticated } = useContext(authContext);
	const handleLogout = (e) => {
		e.preventDefault();
		//alert("User successfully logged in");
		setAuthenticated(false);
		//Remove token from storage
		socket.disconnect();
		navigate('/home');
	};

	return (
		<>
			<Nav>
				<Bars />

				<NavMenu>
					<NavLink to='/home' activestyle="true">
						Home
					</NavLink>
					<NavLink to='/about' activestyle="true">
						About
					</NavLink>
					<div>
						{authenticated ?
							<NavLink to='/tempchat'>
								Chats
							</NavLink> : <></>
						}
					</div>
					<div>
						{authenticated ?
							<NavLink to='/switch'>
								Switch
							</NavLink> : <></>
						}
					</div>
				</NavMenu>
				<div className='user__label'>{authenticated ? (<div> Welcome, {sessionStorage.getItem("userName")}</div>) : <></>}</div>
				<NavBtn>
					<div>{authenticated ?
						<NavBtnLink onClick={handleLogout}>
							Sign Out
						</NavBtnLink> :
						<NavBtnLink to='/login'>
							Sign In
						</NavBtnLink>
					}
					</div>

				</NavBtn>

			</Nav>
		</>
	);
};

