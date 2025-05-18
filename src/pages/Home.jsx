import React from "react";
import "../styles/Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
      <Footer />
    </>
  );
};

export default Home;
