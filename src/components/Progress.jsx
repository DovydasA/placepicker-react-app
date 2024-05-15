import { useEffect, useState } from "react";

const STEP = 100;

function Progress({ timer }) {
	const [remainingTime, setRemainingTime] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setRemainingTime(remainingTime => remainingTime + STEP);
		}, STEP);

		return () => clearInterval(interval);
	}, []);

	return (
		<progress
			value={remainingTime}
			max={timer}
			style={{ width: "100%" }}></progress>
	);
}

export default Progress;
