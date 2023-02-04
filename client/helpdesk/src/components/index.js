import React from 'react';
import {
Nav,
NavLink,
Bars,
NavMenu,
NavBtn,
NavBtnLink,
} from './navbar';

const Navbar = () => {
return (
	<>
	<Nav>
		<Bars />

		<NavMenu>
            <NavLink to='/home' activeStyle>
                Home
            </NavLink>
		    <NavLink to='/about' activeStyle>
			    About
		    </NavLink>
            </NavMenu>
		    <NavBtn>
		    <NavBtnLink to='/login'>
                Sign In
            </NavBtnLink>
		    </NavBtn>

	</Nav>
	</>
);
};

export default Navbar;
