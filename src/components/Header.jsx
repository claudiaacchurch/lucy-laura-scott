import React from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
	return (
		<header className="site-header">
			<div className="header-name">
				<Link to="/">LucyLauraScott:</Link>
			</div>
			<nav className="nav-block">
				<NavLink
					to="/works"
					className={({ isActive }) => (isActive ? "active" : "")}
				>
					Works
				</NavLink>
								|
				<NavLink
					to="/about"
					className={({ isActive }) => (isActive ? "active" : "")}
				>
					About
				</NavLink>
				|
				<NavLink
					to="/cv"
					className={({ isActive }) => (isActive ? "active" : "")}
				>
					CV
				</NavLink>
				|
				<NavLink
					to="/contact"
					className={({ isActive }) => (isActive ? "active" : "")}
				>
					Contact
				</NavLink>
			</nav>
		</header>
	);
};

export default Header;
