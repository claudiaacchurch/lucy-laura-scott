import React from "react";
import "../styles/Contact.css";
import Layout from "../pages/Layout";
import { Mail, Phone, Instagram } from "lucide-react";

const Contact = () => {
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
		<Layout>
			<main className="contact-page">
				<p className="contact-intro">
					For enquiries on available works and collaborations,
					please reach out via email or Instagram.
				</p>

				<div className="contact-columns">
					<form className="contact-form" onSubmit={(e) => e.preventDefault()}>
						<input type="text" name="name" placeholder="Name" required />
						<input type="email" name="email" placeholder="Subject" />
						<textarea name="message" rows="5" placeholder="Message" required />
						<button type="submit">Send</button>
					</form>

					<div className="contact-details">
						<p>
							<Mail size={16} style={{ marginRight: "0.5rem" }} />
							<a href="mailto:lucylaurascott@gmail.com">
								lucylaurascott@gmail.com
							</a>
						</p>
						<p>
							<Instagram size={16} style={{ marginRight: "0.5rem" }} />
							<a
								href={instagramWebUrl}
								target="_blank"
								rel="noreferrer"
								onClick={handleInstagramClick}
							>
								@alottyscotty
							</a>
						</p>
					</div>
				</div>
			</main>
		</Layout>
	);
};

export default Contact;
