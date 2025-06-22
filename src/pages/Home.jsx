import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import "../styles/Home.css";

const Home = () => {
	const [heroImage, setHeroImage] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetch(
			"https://public-api.wordpress.com/wp/v2/sites/claudiaamch6.wordpress.com/posts?tags=400"
		)
			.then((res) => res.json())
			.then((data) => {
				if (!data.length) return;

				const content = data[0].content.rendered;
				const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
				const image = imgMatch ? imgMatch[1] : null;

				setHeroImage(image);
			});
	}, []);

	return (
		<Layout>
			<div className="home-hero-wrapper">
				{heroImage && (
					<>
						<img
							src={heroImage}
							alt="Featured Artwork"
							className={`hero-image ${isLoading ? "hidden" : ""}`}
							onLoad={() => setIsLoading(false)}
						/>
					</>
				)}
			</div>
		</Layout>
	);
};

export default Home;
