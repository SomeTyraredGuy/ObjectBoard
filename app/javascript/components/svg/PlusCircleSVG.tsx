import React from "react";
import SVG from "./SVG";

type Props = {
	className?: string;
};

function PlusCircleSVG({ className }: Props) {
	return (
		<SVG className={className}>
			<circle cx="12" cy="12" r="10" />
			<path d="M8 12h8" />
			<path d="M12 8v8" />
		</SVG>
	);
}

export default PlusCircleSVG;
