import React from "react";
import "../styles/Contact.css";
import Layout from "../pages/Layout";
import { Mail, Phone, Instagram } from "lucide-react";

const Contact = () => {
	return (
		<Layout>
			<main className="contact-page">
				<p className="contact-intro">
					For inquiries, collaborations, or commissions, feel free to reach out
					via email, phone or Instagram.
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
							<Phone size={16} style={{ marginRight: "0.5rem" }} />
							<a href="tel:+447123456789">+44 7123 456 789</a>
						</p>
						<p>
							<Instagram size={16} style={{ marginRight: "0.5rem" }} />
							<a
								href="https://instagram.com/alottyscotty"
								target="_blank"
								rel="noreferrer"
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
