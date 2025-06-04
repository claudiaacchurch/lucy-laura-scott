import React, { useEffect, useState } from "react";
import "../styles/Works.css";
import Layout from "./Layout";

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

const Works = () => {
  const [selectedYear, setSelectedYear] = useState("All");
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    fetch(
      "https://public-api.wordpress.com/wp/v2/sites/claudiaamch6.wordpress.com/posts?tags=2817&_embed"
    )
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((post) => {
          const content = post.content.rendered;
  
          const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
          const image = imgMatch ? imgMatch[1] : null;
  
          const tagList = post._embedded?.["wp:term"]?.[0] || [];
  
          // Try to find a tag that looks like a year (e.g. "2024")
          const yearTag = tagList.find((tag) => /^\d{4}$/.test(tag.name));
          const year = yearTag ? parseInt(yearTag.name) : null;
  
          return {
            title: post.title.rendered,
            image,
            year, // May be null, which is fine
          };
        });
  
        setArtworks(formatted);
      });
  }, []);
  

  const years = ["All", 2022, 2023, 2024, 2025];

  const filteredWorks =
    selectedYear === "All"
      ? artworks
      : artworks.filter((work) => work.year === selectedYear);

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
      <div className="image-container">
        <img src={work.image} alt={work.title} className="work-image" />
        <div className="overlay">
          <span className="work-title">{decodeHTML(work.title)}</span>
        </div>
      </div>
    </div>
  ))}
</div>
    </Layout>
  );
};

export default Works;
