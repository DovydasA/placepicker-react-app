import { useEffect, useRef, useState, useCallback } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

function App() {
	const modal = useRef();
	const selectedPlace = useRef();
	const [places, setPlaces] = useState([]);
	const [pickedPlaces, setPickedPlaces] = useState(() => {
		const storedPlaces = JSON.parse(localStorage.getItem("pickedPlaces"));
		return storedPlaces || [];
	});
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(position => {
			const { latitude, longitude } = position.coords;
			const sortedPlaces = sortPlacesByDistance(
				AVAILABLE_PLACES,
				latitude,
				longitude
			);
			setPlaces(sortedPlaces);
		});
	}, []);

	console.log("App: render");

	function handleStartRemovePlace(id) {
		setIsModalOpen(true);
		selectedPlace.current = id;
	}

	function handleStopRemovePlace() {
		setIsModalOpen(false);
	}

	function handleSelectPlace(id) {
		setPickedPlaces(prevPickedPlaces => {
			if (prevPickedPlaces.some(place => place.id === id)) {
				return prevPickedPlaces;
			}
			const place = places.find(place => place.id === id);
			return [place, ...prevPickedPlaces];
		});
		updateStorageSave("store", id);
	}

	const handleRemovePlace = useCallback(function handleRemovePlace() {
		setPickedPlaces(prevPickedPlaces =>
			prevPickedPlaces.filter(place => place.id !== selectedPlace.current)
		);

		updateStorageSave("remove", selectedPlace.current);
		setIsModalOpen(false);
	}, []);

	function updateStorageSave(action, id) {
		const storedPlaces = JSON.parse(localStorage.getItem("pickedPlaces")) || [];

		if (action === "store") {
			const place = places.find(place => place.id === id);
			if (!place || storedPlaces.some(p => p.id === id)) return; // if place doesn't exist or already exists in pickedPlaces, do nothing
			localStorage.setItem(
				"pickedPlaces",
				JSON.stringify([place, ...storedPlaces])
			);
		}

		if (action === "remove") {
			return localStorage.setItem(
				"pickedPlaces",
				JSON.stringify(storedPlaces.filter(place => place.id !== id))
			);
		}
	}

	return (
		<div className="container">
			<Modal
				ref={modal}
				open={isModalOpen}>
				<DeleteConfirmation
					onCancel={handleStopRemovePlace}
					onConfirm={handleRemovePlace}
				/>
			</Modal>

			<header>
				<img
					src={logoImg}
					alt="Stylized globe"
				/>
				<h1>PlacePicker</h1>
				<p>
					Create your personal collection of places you would like to visit or you
					have visited.
				</p>
			</header>
			<main>
				<Places
					title="I'd like to visit ..."
					fallbackText={"Select the places you would like to visit below."}
					places={pickedPlaces}
					onSelectPlace={handleStartRemovePlace}
				/>
				<Places
					title="Available Places"
					places={places}
					fallbackText={"Sorting places by distance..."}
					onSelectPlace={handleSelectPlace}
				/>
			</main>
		</div>
	);
}

export default App;
