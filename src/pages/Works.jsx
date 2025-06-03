import React, { useState } from "react";
import "../styles/Works.css";
import art1 from "../assets/artworks/flesh-was-dissolved.jpg";
import art2 from "../assets/artworks/gaia.jpg";
import art3 from "../assets/artworks/when-the-birds-fly-home.JPG";
import art4 from "../assets/artworks/flaming-june.jpg";
import art5 from "../assets/artworks/an-english-breakfast.jpg";
import Layout from "./Layout";

const Works = () => {
  const [selectedYear, setSelectedYear] = useState("All");

  const works = [
    { title: "As If Flesh Was Dissolved", image: art1, year: 2022 },
    { title: "Gaia", image: art2, year: 2023 },
    { title: "When the Birds Fly Home", image: art3, year: 2023 },
    { title: "Flaming June", image: art4, year: 2023 },
    { title: "An English Breakfast", image: art5, year: 2025 },
  ];

  const years = ["All", 2022, 2023, 2024, 2025];

  const filteredWorks =
    selectedYear === "All"
      ? works
      : works.filter((work) => work.year === selectedYear);

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

      <div className="works-grid">
        {filteredWorks.map((work, index) => (
          <div className="work-item" key={index}>
            <img src={work.image} alt={work.title} className="work-image" />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Works;