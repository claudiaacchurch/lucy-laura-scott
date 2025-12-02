import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import "../styles/About.css";

const About = () => {
	const [aboutImage, setAboutImage] = useState(null);
	const [aboutContent, setAboutContent] = useState("");
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
				const contentWithoutImage = content.replace(/<img[^>]*>/, "").trim();
				const image = imgMatch ? imgMatch[1] : null;

				setAboutImage(image);
				setAboutContent(contentWithoutImage);
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
					{aboutContent ? (
						<div
							className="about-text"
							dangerouslySetInnerHTML={{ __html: aboutContent }}
						/>
					) : (
						<p className="about-text">Loading artist statement...</p>
					)}
				</div>
			</section>
		</Layout>
	);
};

export default About;
