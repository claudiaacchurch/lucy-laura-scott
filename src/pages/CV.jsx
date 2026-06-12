import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import "../styles/CV.css";

function parseCVSections(renderedContent) {
	const doc = new DOMParser().parseFromString(renderedContent, "text/html");
	const sections = [];

	doc.querySelectorAll("h2").forEach((heading) => {
		const entries = [];
		let sibling = heading.nextElementSibling;

		while (sibling && sibling.tagName !== "H2") {
			sibling.querySelectorAll("li").forEach((listItem) => {
				if (listItem.querySelector("ul, ol")) return;

				const clone = listItem.cloneNode(true);
				const dateElement = clone.querySelector(".cv-date");
				const date = dateElement?.textContent.trim() || "";
				dateElement?.remove();
				const description = clone.innerHTML.trim();

				if (clone.textContent.trim()) {
					entries.push({ date, description });
				}
			});

			sibling = sibling.nextElementSibling;
		}

		if (entries.length) {
			sections.push({
				title: heading.textContent.trim(),
				entries,
			});
		}
	});

	return sections;
}

const CVSkeleton = () => (
	<div className="cv-skeleton" aria-label="Loading CV">
		{Array.from({ length: 3 }, (_, sectionIndex) => (
			<section className="cv-skeleton-section" key={sectionIndex}>
				<span className="cv-skeleton-heading" />
				{Array.from(
					{ length: sectionIndex === 0 ? 7 : 2 },
					(_, entryIndex) => (
						<div className="cv-skeleton-entry" key={entryIndex}>
							<span className="cv-skeleton-date" />
							<span className="cv-skeleton-line" />
						</div>
					),
				)}
			</section>
		))}
	</div>
);

const CV = () => {
	const [sections, setSections] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRevealed, setIsRevealed] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();

		fetch(
			"https://public-api.wordpress.com/wp/v2/sites/claudiaamch6.wordpress.com/pages?slug=cv&_fields=content",
			{ signal: controller.signal },
		)
			.then((res) => {
				if (!res.ok) throw new Error("Could not load CV");
				return res.json();
			})
			.then((data) => {
				const content = data[0]?.content?.rendered;
				if (!content) throw new Error("CV not found");

				setSections(parseCVSections(content));
			})
			.catch((fetchError) => {
				if (fetchError.name !== "AbortError") {
					setError("The CV could not be loaded.");
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsLoading(false);
			});

		return () => controller.abort();
	}, []);

	useEffect(() => {
		if (isLoading || !sections.length) return;

		let secondFrame;
		const firstFrame = window.requestAnimationFrame(() => {
			secondFrame = window.requestAnimationFrame(() => setIsRevealed(true));
		});

		return () => {
			window.cancelAnimationFrame(firstFrame);
			window.cancelAnimationFrame(secondFrame);
		};
	}, [isLoading, sections]);

	return (
		<Layout>
			<main className={`cv-page ${isRevealed ? "is-ready" : ""}`}>
				{isLoading ? (
					<CVSkeleton />
				) : error ? (
					<p className="cv-error">{error}</p>
				) : (
					<div className="cv-content">
						{sections.map((section, sectionIndex) => (
							<section
								className="cv-section"
								key={section.title}
								style={{ transitionDelay: `${sectionIndex * 90}ms` }}
							>
								<h1>{section.title}</h1>
								<ul>
									{section.entries.map((entry, index) => (
										<li key={`${entry.date}-${index}`}>
											<span className="cv-date">{entry.date}</span>
											<span
												className="cv-entry"
												dangerouslySetInnerHTML={{
													__html: entry.description,
												}}
											/>
										</li>
									))}
								</ul>
							</section>
						))}
					</div>
				)}
			</main>
		</Layout>
	);
};

export default CV;
