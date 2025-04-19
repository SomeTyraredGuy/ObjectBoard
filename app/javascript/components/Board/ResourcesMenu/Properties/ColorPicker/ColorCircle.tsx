import React from "react";

const transparentClassName = `
	[background-image:linear-gradient(45deg,_#969696_25%,_transparent_25%,_transparent_75%,_#969696_75%,_#969696),linear-gradient(45deg,_#969696_25%,_transparent_25%,_transparent_75%,_#969696_75%,_#969696)]
    [background-size:0.6rem_0.6rem]
    [background-position:0_0,0.3rem_0.3rem]
`;

type Props = {
	color: string;
	onClick: () => void;
	selected: boolean;
};

function ColorCircle({ color, onClick, selected }: Props) {
	return (
		<div
			data-bs-toggle="tooltip"
			data-bs-placement="top"
			data-bs-title="Tooltip on top"
			className={`border-foreground border-1 h-6 w-6 cursor-pointer rounded-full transition-none ${color === "transparent" && transparentClassName} ${
				selected && "border-secondary shadow-[0_0_0_2px_black] !transition-shadow"
			}`}
			onClick={onClick}
			style={{ backgroundColor: color }}
		></div>
	);
}

export default ColorCircle;
