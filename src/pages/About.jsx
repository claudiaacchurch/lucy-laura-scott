import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import "../styles/About.css";

const About = () => {
	const [aboutImage, setAboutImage] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetch(
			"https://public-api.wordpress.com/wp/v2/sites/claudiaamch6.wordpress.com/posts?tags=256"
		)
			.then((res) => res.json())
			.then((data) => {
				if (!data.length) return;

				const content = data[0].content.rendered;
				const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
				const image = imgMatch ? imgMatch[1] : null;

				setAboutImage(image);
			});
	}, []);

	return (
		<Layout>
			<section className="about-container">
				<div className="about-image-wrapper">
					{aboutImage && (
						<>
							<img
								src={aboutImage}
								alt="Artist"
								className={`artist-image ${isLoading ? "hidden" : ""}`}
								onLoad={() => setIsLoading(false)}
							/>
						</>
					)}
				</div>

				<div className="about-information">
					<h1 className="about-title">Artist's Statement</h1>
					<p className="about-text">
						Lucy Laura Scott is an artist working predominantly with ceramics
						however has a background in film, painting, installation and sound.
						Lucy completed her BA in Fine Art Painting at Brighton University in
						2022, and has exhibited her work in group exhibitions across the UK.
						Lucy's art delves into the complex, often distorted biographical
						narratives, exploring themes of belonging—to oneself, to a space, or
						to another person. Her work evokes a sense of intimacy and
						introspection, inviting viewers to contemplate their own connections
						and disconnections with a space. Through her ceramics, she creates
						tangible forms that echo these feelings, playing with the viewer’s
						perception as participant either within or without the work. Lucy’s
						approach to making involves exploring and playing with the emotions
						that the modern world presents to her. Taking inspiration from old
						and current masters such as Turner, Bernini and Hogarth.
					</p>
				</div>
			</section>
		</Layout>
	);
};

export default About;
