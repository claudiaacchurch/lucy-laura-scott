import React, { useCallback, useEffect, useState } from "react";
import Layout from "./Layout";
import "../styles/About.css";

function resizeWordPressImage(src, width) {
	if (!src) return "";

	try {
		const url = new URL(src);
		if (!url.hostname.endsWith("wordpress.com")) return src;

		url.searchParams.set("w", width);
		url.searchParams.set("quality", "84");
		url.searchParams.set("strip", "info");
		return url.toString();
	} catch {
		return src;
	}
}

function extractAboutContent(renderedContent) {
	const doc = new DOMParser().parseFromString(renderedContent, "text/html");
	const image = doc.querySelector("img");
	const originalImage =
		image?.getAttribute("data-orig-file") || image?.getAttribute("src");

	doc.querySelectorAll("img, figure:empty").forEach((element) => element.remove());

	return {
		image: resizeWordPressImage(originalImage, 1000),
		content: doc.body.innerHTML.trim(),
	};
}

const About = () => {
	const [aboutImage, setAboutImage] = useState(null);
	const [aboutContent, setAboutContent] = useState("");
	const [isContentLoading, setIsContentLoading] = useState(true);
	const [isImageLoaded, setIsImageLoaded] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();

		fetch(
			"https://public-api.wordpress.com/wp/v2/sites/claudiaamch6.wordpress.com/posts?tags=256&per_page=1&_fields=content",
			{ signal: controller.signal },
		)
			.then((res) => {
				if (!res.ok) throw new Error("Could not load artist statement");
				return res.json();
			})
			.then((data) => {
				if (!data.length) throw new Error("Artist statement not found");

				const about = extractAboutContent(data[0].content.rendered);
				setAboutImage(about.image);
				setAboutContent(about.content);
				if (!about.image) setIsImageLoaded(true);
			})
			.catch((fetchError) => {
				if (fetchError.name !== "AbortError") {
					setError("The artist statement could not be loaded.");
					setIsImageLoaded(true);
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsContentLoading(false);
			});

		return () => controller.abort();
	}, []);

	const handleImageReady = useCallback(() => setIsImageLoaded(true), []);

	const handleImageRef = useCallback(
		(image) => {
			if (!image?.complete) return;

			if (typeof image.decode === "function") {
				image.decode().catch(() => {}).finally(handleImageReady);
				return;
			}

			handleImageReady();
		},
		[handleImageReady],
	);

	const isReady = !isContentLoading && isImageLoaded;

	return (
		<Layout>
			<section className={`about-container ${isReady ? "is-ready" : ""}`}>
				<div className="about-image-wrapper">
					<div className="about-image-skeleton" aria-hidden="true" />
					{aboutImage && (
						<img
							ref={handleImageRef}
							src={aboutImage}
							alt="Lucy Laura Scott"
							className="artist-image"
							onLoad={handleImageReady}
							onError={handleImageReady}
							fetchPriority="high"
							decoding="async"
						/>
					)}
				</div>

				<div className="about-information">
					{isContentLoading ? (
						<div className="about-text-skeleton" aria-label="Loading artist statement">
							{Array.from({ length: 8 }, (_, index) => (
								<span key={index} />
							))}
						</div>
					) : aboutContent ? (
						<div
							className="about-text"
							dangerouslySetInnerHTML={{ __html: aboutContent }}
						/>
					) : error ? (
						<p className="about-error">{error}</p>
					) : null}
				</div>
			</section>
		</Layout>
	);
};

export default About;
