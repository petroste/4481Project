import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav
`
font-family: Sailec, Arial, serif;
background: #295cf5;
height: 85px;
display: flex;
justify-content: space-between;
padding: 0.2rem calc((100vw - 1000px) / 2);
z-index: 12;
`
;

export const NavLink = styled(Link)
`
display: flex;
align-items: center;
text-decoration: none;
padding: 0 1rem;
font-family: Sailec, Arial, serif;
cursor: pointer;
background: #295cf5;
padding: 10px 22px;
color: #000000;
outline: none;
border: none;
cursor: pointer;
border-radius: 4px;
transition: all 0.2s ease-in-out;
text-decoration: none;
&.active {
	color: #f5c229;
}
&:hover {
    background: #f5c229;
}
`
;

export const Bars = styled(FaBars)
`
display: none;
color: #f5c229;
@media screen and (max-width: 768px) {
	display: block;
	transform: translate(-100%, 75%);
	font-size: 1.8rem;
	cursor: pointer;
	position: absolute;
	top: 0;
	right: 0;
}
`
;

export const NavMenu = styled.div
`
display: flex;
align-items: center;
margin-right: -24px;
@media screen and (max-width: 768px) {
	display: none;
}
`
;

export const NavBtn = styled.nav
`
display: flex;
align-items: center;
margin-right: 24px;
@media screen and (max-width: 768px) {
	display: none;
}
`
;

export const NavBtnLink = styled(Link)
`
background: #f5c229;
padding: 10px 22px;
color: #000000;
outline: none;
border: none;
cursor: pointer;
border-radius: 4px;
transition: all 0.2s ease-in-out;
text-decoration: none;
/* Second Nav */
margin-left: 24px;
&:hover {
	transition: all 0.2s ease-in-out;
	background: #fff;
	color: #808080;
}
&.active {
    color: #808080;
}
`
;
