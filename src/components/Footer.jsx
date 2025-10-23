import React from "react";
import "../styles/Footer.css";
import { Mail, Instagram } from "lucide-react";

const Footer = () => {
	const currentYear = new Date().getFullYear();
	const instagramWebUrl = "https://instagram.com/alottyscotty";

	const handleInstagramClick = (event) => {
		if (
			typeof window === "undefined" ||
			typeof navigator === "undefined" ||
			typeof document === "undefined"
		) {
			return;
		}

		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		if (!isMobile) {
			return;
		}

		event.preventDefault();

		const instagramAppUrl = "instagram://user?username=alottyscotty";

		const fallbackTimeout = setTimeout(() => {
			window.location.href = instagramWebUrl;
		}, 700);

		const handleVisibilityChange = () => {
			if (document.hidden) {
				clearTimeout(fallbackTimeout);
				document.removeEventListener("visibilitychange", handleVisibilityChange);
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.location.href = instagramAppUrl;
	};

	return (
		<footer className="site-footer">
			<p>&copy; {currentYear} LucyLauraScott</p>
			<div className="footer-links">
				<a href="mailto:lucylaurascott@gmail.com">
					{" "}
					<Mail size={16} style={{ marginRight: "0.5rem" }} />
				</a>
				<span>·</span>
				<a
					href={instagramWebUrl}
					target="_blank"
					rel="noreferrer"
					onClick={handleInstagramClick}
				>
					<Instagram size={16} style={{ marginRight: "0.5rem" }} />
				</a>
			</div>
		</footer>
	);
};

export default Footer;
