import React from "react";
import "../styles/Footer.css";
import { Mail, Instagram } from "lucide-react";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="site-footer">
			<p>&copy; {currentYear} LucyLauraScott</p>
			<div className="footer-links">
				<a href="mailto:lucylaurascott@example.com">
					{" "}
					<Mail size={16} style={{ marginRight: "0.5rem" }} />
				</a>
				<span>·</span>
				<a
								href="https://instagram.com/alottyscotty"
								target="_blank"
								rel="noreferrer"
							>
					<Instagram size={16} style={{ marginRight: "0.5rem" }} />
				</a>
			</div>
		</footer>
	);
};

export default Footer;
