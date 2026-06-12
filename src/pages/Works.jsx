import React, { useEffect, useRef, useState } from "react";
import "../styles/Works.css";
import Layout from "./Layout";
import { Link } from "react-router-dom";

const WORKS_CACHE_KEY = "lucy-laura-scott:works:v2";
const WORKS_CACHE_MAX_AGE = 15 * 60 * 1000;
const CARD_IMAGE_WIDTHS = [320, 480, 640, 800];
const WORDPRESS_API =
	"https://public-api.wordpress.com/wp/v2/sites/claudiaamch6.wordpress.com";

function decodeHTML(html) {
	const txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}

function slugify(text) {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "")
		.replace(/--+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function resizeWordPressImage(src, width) {
	if (!src) return "";

	try {
		const url = new URL(src);

		if (!url.hostname.endsWith("wordpress.com")) return src;

		url.searchParams.set("w", width);
		url.searchParams.set("quality", "82");
		url.searchParams.set("strip", "info");
		return url.toString();
	} catch {
		return src;
	}
}

function getFirstImage(content) {
	const doc = new DOMParser().parseFromString(content, "text/html");
	const image = doc.querySelector("img");

	if (!image) return null;

	const originalSrc =
		image.getAttribute("data-orig-file") ||
		image.getAttribute("src") ||
		image.src;
	const originalSize = image.getAttribute("data-orig-size")?.split(",");
	const renderedWidth = Number(image.getAttribute("width")) || undefined;
	const renderedHeight = Number(image.getAttribute("height")) || undefined;
	const originalWidth = Number(originalSize?.[0]) || renderedWidth;
	const originalHeight = Number(originalSize?.[1]) || renderedHeight;
	const aspectRatio =
		originalWidth && originalHeight ? originalWidth / originalHeight : null;

	return {
		src: resizeWordPressImage(originalSrc, 640),
		srcSet: CARD_IMAGE_WIDTHS.map(
			(width) => `${resizeWordPressImage(originalSrc, width)} ${width}w`,
		).join(", "),
		width: originalWidth,
		height: aspectRatio ? Math.round(originalWidth / aspectRatio) : originalHeight,
		originalSrc,
	};
}

function readCachedWorks() {
	try {
		const cachedWorks = localStorage.getItem(WORKS_CACHE_KEY);
		if (!cachedWorks) return null;

		const cache = JSON.parse(cachedWorks);
		if (
			Array.isArray(cache.artworks) &&
			Date.now() - cache.timestamp < WORKS_CACHE_MAX_AGE
		) {
			return cache.artworks;
		}
	} catch {
		// Storage can be unavailable in private or restricted browser contexts.
	}

	return null;
}

function cacheWorks(artworks) {
	try {
		localStorage.setItem(
			WORKS_CACHE_KEY,
			JSON.stringify({ timestamp: Date.now(), artworks }),
		);
	} catch {
		// Loading the page should never depend on storage being writable.
	}
}

function formatArtworks(data, tagNames) {
	return data
		.map((post) => {
			const content = post.content.rendered;
			const image = getFirstImage(content);
			const yearName = post.tags
				.map((tagId) => tagNames.get(tagId))
				.find((tagName) => /^\d{4}$/.test(tagName));
			const year = yearName ? parseInt(yearName) : null;
			const title = decodeHTML(post.title.rendered);

			return {
				title,
				image: image?.src,
				originalImage: image?.originalSrc,
				imageSrcSet: image?.srcSet,
				imageWidth: image?.width,
				imageHeight: image?.height,
				year,
				slug: slugify(title),
				content,
				additionalImages: image ? [image.originalSrc] : [],
			};
		})
		.filter((work) => work.image);
}

const ArtworkCard = ({ work, index }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const cardRef = useRef(null);

	useEffect(() => {
		const card = cardRef.current;
		if (!card) return;

		if (!("IntersectionObserver" in window)) {
			setIsVisible(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;

				setIsVisible(true);
				observer.disconnect();
			},
			{
				rootMargin: "0px 0px 80px 0px",
				threshold: 0.01,
			},
		);

		observer.observe(card);
		return () => observer.disconnect();
	}, []);

	return (
		<Link
			ref={cardRef}
			className={`work-link ${isVisible ? "is-visible" : ""}`}
			to={`/works/${work.slug}`}
			state={{ artwork: work, content: work.content }}
			style={{ "--reveal-delay": `${(index % 4) * 45}ms` }}
		>
			<article className={`image-container ${isLoaded ? "is-loaded" : ""}`}>
				<img
					src={work.image}
					srcSet={work.imageSrcSet}
					sizes="(min-width: 960px) 25vw, 50vw"
					width={work.imageWidth}
					height={work.imageHeight}
					alt={work.title}
					className="work-image"
					onLoad={() => setIsLoaded(true)}
					onError={() => setIsLoaded(true)}
					loading={index < 4 ? "eager" : "lazy"}
					fetchPriority={index === 0 ? "high" : "auto"}
					decoding="async"
				/>
				<div className="overlay">
					<div className="work-caption">
						<h2 className="work-title">{work.title}</h2>
						{work.year && <p className="work-year">{work.year}</p>}
					</div>
				</div>
			</article>
		</Link>
	);
};

const Works = () => {
	const [selectedYear, setSelectedYear] = useState("All");
	const [artworks, setArtworks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();
		const cachedWorks = readCachedWorks();

		if (cachedWorks) {
			setArtworks(cachedWorks);
			setIsLoading(false);
			return () => controller.abort();
		}

		Promise.all([
			fetch(
				`${WORDPRESS_API}/posts?tags=2817&per_page=40&_fields=title,content,tags`,
				{ signal: controller.signal },
			),
			fetch(`${WORDPRESS_API}/tags?per_page=100&_fields=id,name`, {
				signal: controller.signal,
			}),
		])
			.then(async ([postsResponse, tagsResponse]) => {
				if (!postsResponse.ok || !tagsResponse.ok) {
					throw new Error("Could not load artworks");
				}

				return Promise.all([postsResponse.json(), tagsResponse.json()]);
			})
			.then(([posts, tags]) => {
				const tagNames = new Map(tags.map((tag) => [tag.id, tag.name]));
				const formatted = formatArtworks(posts, tagNames);

				setArtworks(formatted);
				cacheWorks(formatted);
			})
			.catch((fetchError) => {
				if (fetchError.name !== "AbortError") {
					setError("The artworks could not be loaded. Please try again shortly.");
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsLoading(false);
			});

		return () => controller.abort();
	}, []);

	const years = React.useMemo(() => {
		const uniqueYears = [
			...new Set(
				artworks.map((work) => work.year).filter((year) => year !== null),
			),
		];
		const sortedYears = uniqueYears.sort((a, b) => a - b);
		return ["All", ...sortedYears];
	}, [artworks]);

	const filteredWorks = React.useMemo(
		() =>
			selectedYear === "All"
				? artworks
				: artworks.filter((work) => work.year === selectedYear),
		[artworks, selectedYear],
	);

	return (
		<Layout>
			<div
				className="filter-buttons"
				aria-label="Filter artworks by year"
				role="group"
			>
				{years.map((year) => (
					<button
						key={year}
						className={selectedYear === year ? "active" : ""}
						onClick={() => setSelectedYear(year)}
						aria-pressed={selectedYear === year}
					>
						{year}
					</button>
				))}
			</div>

			{error && <p className="works-message">{error}</p>}

			{isLoading ? (
				<div className="works-grid works-grid-loading" aria-label="Loading artworks">
					{Array.from({ length: 8 }, (_, index) => (
						<div className="work-skeleton" key={index} />
					))}
				</div>
			) : (
				<div className="works-grid" key={selectedYear}>
					{filteredWorks.map((work, index) => (
						<ArtworkCard key={work.slug} work={work} index={index} />
					))}
				</div>
			)}
		</Layout>
	);
};

export default Works;
