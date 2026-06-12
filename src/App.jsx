import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import About from "./pages/About";
import Works from "./pages/Works";
import ArtworkDetail from "./pages/ArtworkDetail";
import CV from "./pages/CV";
import Contact from "./pages/Contact";
import SoundCloudPlayer from "./components/SoundCloudPlayer";
import "./styles/Generic.css";

function App() {
	const location = useLocation();

	useEffect(() => {
		const frame = window.requestAnimationFrame(() => {
			window.scrollTo({ top: 0, left: 0, behavior: "instant" });
			document.querySelector(".layout-main")?.scrollTo({
				top: 0,
				left: 0,
				behavior: "instant",
			});
		});

		return () => window.cancelAnimationFrame(frame);
	}, [location.pathname]);

	return (
		<>
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Works />} />
				<Route path="/about" element={<About />} />
				<Route path="/works" element={<Works />} />
				<Route path="/works/:slug" element={<ArtworkDetail />} />
				<Route path="/cv" element={<CV />} />
				<Route path="/contact" element={<Contact />} />
			</Routes>
			<SoundCloudPlayer />
		</>
	);
}

export default App;
