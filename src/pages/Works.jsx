import React from "react";
import Header from "../components/Header";
import "../styles/Works.css";
import art1 from "../assets/artworks/flesh-was-dissolved.jpg";
import art2 from "../assets/artworks/gaia.jpg";
import art3 from "../assets/artworks/when-the-birds-fly-home.JPG";
import art4 from "../assets/artworks/flaming-june.jpg";
import art5 from "../assets/artworks/an-english-breakfast.jpg";

const Works = () => {
    
    const works = [
      { title: "As If Flesh Was Dissolved", image: art1 },
      { title: "Gaia", image: art2 },
      { title: "When the Birds Fly Home", image: art3 },
      { title: "Flaming June", image: art4 },
      { title: "An English Breakfast", image: art5 }
    ];
  
    return (
        <>
        <Header/>
      <main className="works-page">
        <div className="works-grid">
        {works.map((work, index) => (
          <div className="work-item" key={index}>
            <img src={work.image} alt={work.title} className="work-image" />
          </div>
        ))}
        </div>
      </main>
      </>
    );
  };

export default Works;