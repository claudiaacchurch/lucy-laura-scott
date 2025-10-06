import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Works from "./pages/Works";
import ArtworkDetail from "./pages/ArtworkDetail";
import CV from "./pages/CV";
import Contact from "./pages/Contact";
import "./styles/Generic.css";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Works />} />
				<Route path="/about" element={<About />} />
				<Route path="/works" element={<Works />} />
				<Route path="/works/:slug" element={<ArtworkDetail />} />
				<Route path="/cv" element={<CV />} />
				<Route path="/contact" element={<Contact />} />
			</Routes>
		</>
	);
}

export default App;
