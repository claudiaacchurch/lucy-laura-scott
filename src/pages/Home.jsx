import React from "react";
import Header from "../components/Header";
import "../styles/Home.css";

const Home = () => {
  return (
    <>
      <Header />
      <main className="home-main">
        <img
          src="/header-img.jpg"
          alt="Featured Artwork"
          className="hero-image"
        />
      </main>
    </>
  );
};

export default Home;
