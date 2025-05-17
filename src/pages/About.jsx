import React from "react";
import Header from "../components/Header";
import "../styles/About.css";

const About = () => {
  return (
    <>
      <Header />
      <main className="about-main">
        <img
          src="/header-img.jpg"
          alt="Featured Artwork"
          className="hero-image"
        />
      </main>
    </>
  );
};

export default About;
