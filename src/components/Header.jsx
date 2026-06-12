import React from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
	return (
		<header className="site-header">
			<div className="header-inner">
				<Link to="/">
					<img
						src="/lucylaurascott.png"
						alt="LucyLauraScott"
						className="header-img"
						loading="eager"
						fetchPriority="high"
						decoding="async"
					/>
				</Link>

				<nav className="nav-block" aria-label="Primary navigation">
					<NavLink
						to="/works"
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						Works
					</NavLink>
					<NavLink
						to="/about"
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						About
					</NavLink>
					<NavLink
						to="/cv"
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						CV
					</NavLink>
					<NavLink
						to="/contact"
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						Contact
					</NavLink>
				</nav>
			</div>
		</header>
	);
};

export default Header;
