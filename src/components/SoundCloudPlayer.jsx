import React, { useEffect, useRef, useState } from "react";
import "../styles/SoundCloudPlayer.css";

const SoundCloudPlayer = () => {
	const iframeRef = useRef(null);
	const widgetRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [bottomOffset, setBottomOffset] = useState(20);

	useEffect(() => {
		const footer = document.querySelector(".site-footer");
		if (!footer) return;

		const updatePosition = () => {
			const footerRect = footer.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			if (footerRect.top < viewportHeight) {
				setBottomOffset(viewportHeight - footerRect.top + 20);
			} else {
				setBottomOffset(20);
			}
		};

		const scrollContainer = document.querySelector(".layout-main") || window;
		scrollContainer.addEventListener("scroll", updatePosition, { passive: true });
		window.addEventListener("resize", updatePosition, { passive: true });
		updatePosition();

		return () => {
			scrollContainer.removeEventListener("scroll", updatePosition);
			window.removeEventListener("resize", updatePosition);
		};
	}, []);

	useEffect(() => {
		// Load SoundCloud Widget API
		const tag = document.createElement("script");
		tag.src = "https://w.soundcloud.com/player/api.js";
		const firstScriptTag = document.getElementsByTagName("script")[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		tag.onload = () => {
			widgetRef.current = window.SC.Widget(iframeRef.current);

			// Auto-play on load
			widgetRef.current.bind(window.SC.Widget.Events.READY, () => {
				widgetRef.current.play();
				setIsPlaying(true);
			});

			// Listen for play/pause events
			widgetRef.current.bind(window.SC.Widget.Events.PLAY, () => {
				setIsPlaying(true);
			});

			widgetRef.current.bind(window.SC.Widget.Events.PAUSE, () => {
				setIsPlaying(false);
			});
		};
	}, []);

	const togglePlay = () => {
		if (widgetRef.current) {
			widgetRef.current.toggle();
		}
	};

	return (
		<div className="soundcloud-player-container" style={{ bottom: `${bottomOffset}px` }}>
			<button onClick={togglePlay} className="play-pause-button" aria-label={isPlaying ? "Pause" : "Play"}>
				{isPlaying ? "❚❚" : "▶"}
			</button>
			<iframe
				ref={iframeRef}
				width="0"
				height="0"
				style={{ display: "none" }}
				allow="autoplay"
				src="https://w.soundcloud.com/player/?url=https://soundcloud.com/user-305779245-316713718/sounds-for-room&auto_play=true"
			/>
		</div>
	);
};

export default SoundCloudPlayer;
