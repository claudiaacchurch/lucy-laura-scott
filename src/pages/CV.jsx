import React from "react";
import Layout from "./Layout";
import "../styles/CV.css";

const CV = () => {
	return (
		<Layout>
			<main className="cv-page">
				<section>
					<h2>Group Exhibitions</h2>
					<ul>
						<li>
							<span className="cv-date">2025</span> Artists open houses,
							Brighton{" "}
						</li>
						<li>
							<span className="cv-date">2025</span> Pedestal, Gallery 19A,
							Brighton
						</li>
						<li>
							<span className="cv-date">2024</span> Open, Atelier Beside the
							Sea, Brighton
						</li>
						<li>
							<span className="cv-date">2024</span> In The Corner of My Eye, The
							KOPPEL collective, Chalk Farm
						</li>
						<li>
							<span className="cv-date">2024</span> Phony Art Collective,
							Gallery Lock in, Brighton
						</li>
						<li>
							<span className="cv-date">2024</span> Dream Week, The Tabernacle,
							by Open Art Spaces, London
						</li>
						<li>
							<span className="cv-date">2023</span> Crawl Space, The Crypt
							Gallery, London
						</li>
						<li>
							<span className="cv-date">2022</span> Silo ono, Virtual
							exhibition, Fresh Salad
						</li>
						<li>
							<span className="cv-date">2022</span> Concrete, The fishing
							Quarter Gallery, Brighton
						</li>
						<li>
							<span className="cv-date">2022</span> Materialised Intention,
							Presuming Ed, Brighton
						</li>
						<li>
							<span className="cv-date">2022</span> Brighton Summer Show,
							University of Brighton, Brighton
						</li>
					</ul>
				</section>
				<section>
					<h2>Solo Exhibitions</h2>
					<ul>
						<li>
							<span className="cv-date">2018</span> "Sensibility", Culworth
							Forge, Oxfordshire
						</li>
					</ul>
				</section>
				<section>
					<h2>Other</h2>
					<ul>
						<li>
							<span className="cv-date">2025</span> Became a member of common
							Clay, bexhill{" "}
						</li>
						<li>
							<span className="cv-date">2025</span> One night exhibition of food
							and art– pop up , Notting hill, London
						</li>
					</ul>
				</section>
				<section>
					<h2>Education</h2>
					<ul>
						<li>
							<span className="cv-date">2018-2022</span> BA Fine Art Painting –
							First Class Honours, University of Brighton
						</li>
					</ul>
				</section>
			</main>
		</Layout>
	);
};

export default CV;
