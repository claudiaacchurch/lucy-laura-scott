import React, { useEffect, useState } from "react";
import "../styles/Works.css";
import Layout from "./Layout";
import { Link } from "react-router-dom";

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

const Works = () => {
	const [selectedYear, setSelectedYear] = useState("All");
	const [artworks, setArtworks] = useState([]);
	const [loadedCount, setLoadedCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetch(
			"https://public-api.wordpress.com/wp/v2/sites/claudiaamch6.wordpress.com/posts?tags=2817&_embed&per_page=100"
		)
			.then((res) => res.json())
			.then((data) => {
				const formatted = data.map((post) => {
					const content = post.content.rendered;
					const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
					const image = imgMatch ? imgMatch[1] : null;

					const allTags = post._embedded?.["wp:term"]?.flat() || [];
					const yearTag = allTags.find((tag) => /^\d{4}$/.test(tag.name));
					const year = yearTag ? parseInt(yearTag.name) : null;

					const title = decodeHTML(post.title.rendered);

					return {
						title,
						image,
						year,
						slug: slugify(title),
						content: post.content.rendered,
						additionalImages: [image],
					};
				});

				setArtworks(formatted);
			});
	}, []);

	// Dynamically extract unique years from artworks
	const years = React.useMemo(() => {
		const uniqueYears = [...new Set(artworks.map(work => work.year).filter(year => year !== null))];
		const sortedYears = uniqueYears.sort((a, b) => a - b); // Sort ascending
		return ["All", ...sortedYears];
	}, [artworks]);

	const filteredWorks =
		selectedYear === "All"
			? artworks
			: artworks.filter((work) => work.year === selectedYear);

	useEffect(() => {
		if (loadedCount === filteredWorks.length && filteredWorks.length > 0) {
			setIsLoading(false);
		}
	}, [loadedCount, filteredWorks]);

	return (
		<Layout>
			<div className="filter-buttons">
				{years.map((year) => (
					<button
						key={year}
						className={selectedYear === year ? "active" : ""}
						onClick={() => setSelectedYear(year)}
					>
						{year}
					</button>
				))}
			</div>

			{isLoading && (
				<div className="spinner-wrapper">
					<div className="spinner" />
				</div>
			)}

			<div className="works-grid">
				{filteredWorks.map((work, index) => (
					<Link
						key={index}
						to={`/works/${work.slug}`}
						state={{ artwork: work, content: work.content }}
					>
						<div className="image-container">
							<img
								src={work.image}
								alt={work.title}
								className="work-image"
								onLoad={() => setLoadedCount((count) => count + 1)}
								loading="lazy"
							/>
							<div className="overlay">
								<span className="work-title">{decodeHTML(work.title)}</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</Layout>
	);
};

export default Works;
