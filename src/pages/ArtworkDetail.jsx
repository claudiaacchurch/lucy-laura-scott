import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "./Layout";
import "../styles/ArtworkDetail.css";

const ArtworkDetails = () => {
	const { slug } = useParams();
	const location = useLocation();
	const artwork = location.state?.artwork;
	const content = location.state?.content;
	const [relatedImages, setRelatedImages] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (!slug) return;

		fetch(
			`https://public-api.wordpress.com/wp/v2/sites/claudiaamch6.wordpress.com/tags?slug=${slug}`
		)
			.then((res) => res.json())
			.then((data) => {
				const tagId = data[0]?.id;
				if (!tagId) return;

				return fetch(
					`https://public-api.wordpress.com/wp/v2/sites/claudiaamch6.wordpress.com/posts?tags=${tagId}`
				);
			})
			.then((res) => res?.json())
			.then((posts) => {
				if (!Array.isArray(posts)) return;

				const imgs = posts
					.map((post) => {
						const match = post.content.rendered.match(
							/<img[^>]+src="([^">]+)"/
						);
						return match ? match[1] : null;
					})
					.filter(Boolean);

				setRelatedImages(imgs);
			})
			.catch((err) => {
				console.error("Error fetching related images:", err);
			});
	}, [slug]);

	if (!artwork || artwork.slug !== slug) {
		return (
			<Layout>
				<div className="artwork-details">
					<p>Artwork not found.</p>
				</div>
			</Layout>
		);
	}

	const allImages = [...new Set([artwork.image, ...relatedImages])];
	const textContent = content.replace(/<img[^>]*>/i, "");

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % allImages.length);
	};

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
	};

	return (
		<Layout>
			<div className="artwork-details">
				<div className="custom-carousel">
					{allImages.length > 1 && (
						<button className="carousel-btn left" onClick={handlePrev}>
							‹
						</button>
					)}

					<img
						src={allImages[currentIndex]}
						alt={`${artwork.title} ${currentIndex + 1}`}
						className="carousel-image"
					/>

					{allImages.length > 1 && (
						<button className="carousel-btn right" onClick={handleNext}>
							›
						</button>
					)}
				</div>

				<div className="artwork-text">
					<h1 className="artwork-title">{artwork.title}</h1>
					<div
						className="artwork-description"
						dangerouslySetInnerHTML={{ __html: textContent }}
					/>
				</div>
			</div>
		</Layout>
	);
};

export default ArtworkDetails;
