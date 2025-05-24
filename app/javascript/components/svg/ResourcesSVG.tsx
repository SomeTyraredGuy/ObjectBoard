import React from "react";
import SVG from "./SVG";

type Props = {
	className?: string;
};

function PaletteSVG({ className }: Props) {
	return (
		<SVG className={className}>
			<>
				<circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
				<circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
				<circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
				<circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
				<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
			</>
		</SVG>
	);
}

function FolderSVG({ className }: Props) {
	return (
		<SVG className={className}>
			<path d="M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z" />
			<path d="M2 8v11a2 2 0 0 0 2 2h14" />
		</SVG>
	);
}

function TrashSVG({ className }: Props) {
	return (
		<SVG className={className}>
			<path d="M3 6h18" />
			<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
			<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
			<line x1="10" x2="10" y1="11" y2="17" />
			<line x1="14" x2="14" y1="11" y2="17" />
		</SVG>
	);
}

function LockSVG({ className }: Props) {
	return (
		<SVG className={className}>
			<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
			<path d="M7 11V7a5 5 0 0 1 10 0v4" />
		</SVG>
	);
}

export { PaletteSVG, FolderSVG, TrashSVG, LockSVG };
