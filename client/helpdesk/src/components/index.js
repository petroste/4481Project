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

export default function Navbar() {
	const navigate = useNavigate();
	const {authenticated, setAuthenticated} = useContext(authContext);

	const handleLogout = (e) => {
        e.preventDefault();
        //alert("User successfully logged in");
        setAuthenticated(false);
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
				</NavLink> :
				null}
			</div>
            </NavMenu>
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

