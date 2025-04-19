import React from "react";
import Hint from "./Hint";
import HelpSVG from "@/components/svg/HelpSVG";

type Props = {
	title?: string;
	description?: string;
	side?: "top" | "bottom" | "left" | "right";
	className?: string;
};

function HintIcon({ className, title, description, side = "bottom" }: Props) {
	return (
		<Hint title={title} description={description} side={side}>
			<HelpSVG className={`opacity-60 ${className}`} />
		</Hint>
	);
}

export default HintIcon;
