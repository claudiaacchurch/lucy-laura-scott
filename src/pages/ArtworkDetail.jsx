import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "./Layout";
import "../styles/ArtworkDetail.css";

function normalizeImageUrl(src) {
	if (!src) return "";

	try {
		const url = new URL(src);
		url.search = "";
		url.hash = "";
		return url.toString();
	} catch {
		return src;
	}
}

function extractImageUrls(content) {
	const doc = new DOMParser().parseFromString(content, "text/html");

	return [...doc.querySelectorAll("img")]
		.map((image) =>
			normalizeImageUrl(
				image.getAttribute("data-orig-file") || image.getAttribute("src"),
			),
		)
		.filter(Boolean);
}

const ArtworkDetails = () => {
	const { slug } = useParams();
	const location = useLocation();
	const artwork = location.state?.artwork;
	const content = location.state?.content;
	const [relatedImages, setRelatedImages] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isGalleryLoading, setIsGalleryLoading] = useState(true);
	const [isCurrentImageLoaded, setIsCurrentImageLoaded] = useState(false);
	const [hasGalleryRevealed, setHasGalleryRevealed] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const transitionTimeout = useRef(null);
	const allImages = useMemo(
		() => {
			if (!artwork) return [];

			const leadImage = normalizeImageUrl(
				artwork.originalImage || artwork.image,
			);

			return [
				...new Set([leadImage, ...relatedImages.map(normalizeImageUrl)].filter(Boolean)),
			];
		},
		[artwork, relatedImages],
	);
	const currentImage = allImages[currentIndex];

	useEffect(() => {
		if (!slug) {
			setIsGalleryLoading(false);
			return;
		}

		const controller = new AbortController();
		const normalizedSlug = slug.replace(/,/g, "");
		setIsGalleryLoading(true);
		setHasGalleryRevealed(false);
		setIsCurrentImageLoaded(false);
		setIsTransitioning(false);
		setRelatedImages([]);
		setCurrentIndex(0);
		window.clearTimeout(transitionTimeout.current);

		fetch(
			`https://public-api.wordpress.com/wp/v2/sites/claudiaamch6.wordpress.com/tags?slug=${normalizedSlug}`,
			{ signal: controller.signal },
		)
			.then((res) => {
				if (!res.ok) throw new Error("Could not load artwork gallery");
				return res.json();
			})
			.then((data) => {
				const tagId = data[0]?.id;
				if (!tagId) return;

				return fetch(
					`https://public-api.wordpress.com/wp/v2/sites/claudiaamch6.wordpress.com/posts?tags=${tagId}&per_page=100&orderby=date&order=asc&_fields=content`,
					{ signal: controller.signal },
				);
			})
			.then((res) => {
				if (!res) return [];
				if (!res.ok) throw new Error("Could not load artwork gallery");
				return res.json();
			})
			.then((posts) => {
				if (!Array.isArray(posts)) return;

				const imgs = posts.flatMap((post) =>
					extractImageUrls(post.content.rendered),
				);

				setRelatedImages(imgs);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					console.error("Error fetching related images:", err);
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsGalleryLoading(false);
			});

		return () => controller.abort();
	}, [slug]);

	useEffect(
		() => () => {
			window.clearTimeout(transitionTimeout.current);
		},
		[],
	);

	useEffect(() => {
		if (!isGalleryLoading && isCurrentImageLoaded) {
			setHasGalleryRevealed(true);
		}
	}, [isGalleryLoading, isCurrentImageLoaded]);

	useEffect(() => {
		if (allImages.length < 2) return;

		const nextIndex = (currentIndex + 1) % allImages.length;
		const previousIndex =
			currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;

		[allImages[nextIndex], allImages[previousIndex]].forEach((src) => {
			const image = new Image();
			image.src = src;
		});
	}, [allImages, currentIndex]);

	const handleCurrentImageReady = useCallback(() => {
		setIsCurrentImageLoaded(true);
		setIsTransitioning(false);
	}, []);

	const handleImageRef = useCallback(
		(image) => {
			if (!image?.complete) return;

			if (typeof image.decode === "function") {
				image.decode().catch(() => {}).finally(handleCurrentImageReady);
				return;
			}

			handleCurrentImageReady();
		},
		[handleCurrentImageReady],
	);

	if (!artwork || artwork.slug !== slug) {
		return (
			<Layout>
				<div className="artwork-details">
					<p>Artwork not found.</p>
				</div>
			</Layout>
		);
	}

	const textContent = (content || "").replace(/<img[^>]*>/i, "");

	const changeImage = (direction) => {
		if (isTransitioning || allImages.length < 2) return;

		setIsTransitioning(true);
		setIsCurrentImageLoaded(false);

		transitionTimeout.current = window.setTimeout(() => {
			setCurrentIndex((previousIndex) => {
				if (direction === "next") {
					return (previousIndex + 1) % allImages.length;
				}

				return previousIndex === 0
					? allImages.length - 1
					: previousIndex - 1;
			});
		}, 180);
	};

	return (
		<Layout>
			<div className="artwork-details">
				<div
					className={`custom-carousel ${hasGalleryRevealed ? "is-ready" : ""}`}
				>
					{allImages.length > 1 && (
						<button
							className="carousel-btn left"
							onClick={() => changeImage("previous")}
							aria-label="Previous artwork image"
							disabled={isTransitioning}
						>
							‹
						</button>
					)}

					<div className="carousel-stage">
						<img
							ref={handleImageRef}
							key={currentImage}
							src={currentImage}
							alt={`${artwork.title} ${currentIndex + 1}`}
							className={`carousel-image ${
								isCurrentImageLoaded ? "is-loaded" : ""
							} ${isTransitioning ? "is-transitioning" : ""}`}
							onLoad={handleCurrentImageReady}
							onError={handleCurrentImageReady}
							decoding="async"
						/>
					</div>

					{allImages.length > 1 && (
						<button
							className="carousel-btn right"
							onClick={() => changeImage("next")}
							aria-label="Next artwork image"
							disabled={isTransitioning}
						>
							›
						</button>
					)}

					{allImages.length > 1 && (
						<p className="carousel-count" aria-live="polite">
							<span>{String(currentIndex + 1).padStart(2, "0")}</span>
							<span aria-hidden="true">/</span>
							<span>{String(allImages.length).padStart(2, "0")}</span>
						</p>
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
