import { useEffect } from "react";
import Progress from "./Progress.jsx";

const TIMER = 5000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
	useEffect(() => {
		console.log("DeleteConfirmation: Timer started");
		const timeout = setTimeout(() => {
			console.log("DeleteConfirmation: Timer expired");
			onConfirm();
		}, TIMER);

		return () => {
			console.log("DeleteConfirmation: Timer cleared");
			clearTimeout(timeout);
		};
	}, [onConfirm]);

	return (
		<div id="delete-confirmation">
			<h2>Are you sure?</h2>
			<p>Do you really want to remove this place?</p>
			<div id="confirmation-actions">
				<button
					onClick={onCancel}
					className="button-text">
					No
				</button>
				<button
					onClick={onConfirm}
					className="button">
					Yes
				</button>
			</div>
			<Progress timer={TIMER} />
		</div>
	);
}
