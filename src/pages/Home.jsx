import React from "react";
import Layout from "./Layout";
import "../styles/Home.css";

const Home = () => {
  return (
    <Layout>
      <div className="home-hero-wrapper">
        <img
          src="/header-img.jpg"
          alt="Featured Artwork"
          className="hero-image"
        />
      </div>
    </Layout>
  );
};

export default Home;
