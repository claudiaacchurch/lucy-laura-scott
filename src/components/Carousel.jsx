import React from "react";
import "../styles/Carousel.css";

const Carousel = ({ images }) => {
	const [currentIndex, setCurrentIndex] = React.useState(0);

	if (!images || images.length === 0) return null;

	const nextImage = () => {
		setCurrentIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	return (
		<div className="carousel">
			{images.length > 1 && (
				<button onClick={prevImage} className="arrow">
					&#8592;
				</button>
			)}
			<img
				src={images[currentIndex]}
				alt={`Slide ${currentIndex + 1}`}
				className="carousel-image"
			/>
			{images.length > 1 && (
				<button onClick={nextImage} className="arrow">
					&#8594;
				</button>
			)}
		</div>
	);
};

export default Carousel;
