import React from "react";
import "../styles/Layout.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
	return (
		<div className="layout-container">
			<Header />
			<main className="layout-main">{children}</main>
			<Footer />
		</div>
	);
};

export default Layout;
