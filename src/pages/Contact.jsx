import React from "react";
import "../styles/Contact.css";
import Layout from "../pages/Layout";
import { ArrowUpRight, Instagram, Mail } from "lucide-react";

const Contact = () => {
	const instagramWebUrl = "https://instagram.com/alottyscotty";
	const emailAddress = "lucylaurascott@gmail.com";

	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const name = formData.get("name")?.toString().trim();
		const email = formData.get("email")?.toString().trim();
		const subject =
			formData.get("subject")?.toString().trim() || "Artwork enquiry";
		const message = formData.get("message")?.toString().trim();
		const body = [
			message,
			"",
			name ? `From: ${name}` : "",
			email ? `Reply to: ${email}` : "",
		]
			.filter(Boolean)
			.join("\n");

		window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(
			subject,
		)}&body=${encodeURIComponent(body)}`;
	};

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
				<section className="contact-information">
					<p className="contact-kicker">Contact</p>
					<p className="contact-intro">
						For enquiries about available works, exhibitions, commissions,
						or collaborations, please get in touch.
					</p>

					<div className="contact-details">
						<a href={`mailto:${emailAddress}`}>
							<span className="contact-icon">
								<Mail size={17} aria-hidden="true" />
							</span>
							<span>
								<small>Email</small>
								{emailAddress}
							</span>
						</a>
						<a
							href={instagramWebUrl}
							target="_blank"
							rel="noreferrer"
							onClick={handleInstagramClick}
						>
							<span className="contact-icon">
								<Instagram size={17} aria-hidden="true" />
							</span>
							<span>
								<small>Instagram</small>
								@alottyscotty
							</span>
						</a>
					</div>
				</section>

				<section className="contact-form-section">
					<p className="contact-form-title">Send an enquiry</p>

					<form className="contact-form" onSubmit={handleSubmit}>
						<div className="contact-field-row">
							<label>
								<span>Name</span>
								<input
									type="text"
									name="name"
									autoComplete="name"
									required
								/>
							</label>
							<label>
								<span>Email</span>
								<input
									type="email"
									name="email"
									autoComplete="email"
									required
								/>
							</label>
						</div>

						<label>
							<span>Subject</span>
							<input
								type="text"
								name="subject"
							/>
						</label>

						<label>
							<span>Message</span>
							<textarea
								name="message"
								rows="6"
								placeholder="Tell me a little about your enquiry..."
								required
							/>
						</label>

						<button type="submit">
							<span>Send email</span>
							<ArrowUpRight size={17} aria-hidden="true" />
						</button>
					</form>
				</section>
			</main>
		</Layout>
	);
};

export default Contact;
