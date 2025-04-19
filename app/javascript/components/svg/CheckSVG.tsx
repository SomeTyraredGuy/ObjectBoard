import React from "react";
import SVG from "./SVG";

type Props = {
	className?: string;
};

function CheckSVG({ className }: Props) {
	return (
		<SVG className={className}>
			<path d="M20 6 9 17l-5-5" />
		</SVG>
	);
}

export default CheckSVG;
