import React from "react";
import Layout from "./Layout";
import "../styles/CV.css";
import { useEffect, useState } from "react";

const CV = () => {
	const [cvContent, setCvContent] = useState("");
	useEffect(() => {
	fetch("https://public-api.wordpress.com/wp/v2/sites/claudiaamch6.wordpress.com/pages?slug=cv")
		.then((res) => res.json())
		.then((data) => setCvContent(data[0]?.content?.rendered || ""));
	}, []);

	return (
		<Layout>
			<main className="cv-page">
				{cvContent ? (
					<div dangerouslySetInnerHTML={{ __html: cvContent }} />
				) : (
					<p>Loading CV...</p>
				)}
			</main>
		</Layout>
	);
};

export default CV;
