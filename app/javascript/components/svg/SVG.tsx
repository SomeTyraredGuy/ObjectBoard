import React from "react";

type Props = {
	children: React.ReactNode;
	className?: string;
};

function SVG({ children, className }: Props) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			{children}
		</svg>
	);
}

export default SVG;
