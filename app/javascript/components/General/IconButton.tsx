import React from "react";
import Hint from "./Hint/Hint";
import { Button } from "@/shadcn/components/ui/button";

type Props = {
	icon: React.ElementType;
	onClick?: () => void;
	label?: string;
	isDisabled?: boolean;
	isActive?: boolean;
	side: "top" | "bottom" | "left" | "right";
	className?: string;
};

function IconButton({ icon: Icon, onClick, label, isDisabled, isActive, side, className }: Props) {
	return (
		<Hint side={side} title={label}>
			<Button
				variant="outline"
				size="icon"
				className={`button-hover ${isActive ? "bg-primary text-secondary" : ""} ${className}`}
				onClick={onClick}
				disabled={isDisabled}
			>
				<Icon className="size-3/5" />
			</Button>
		</Hint>
	);
}

export default IconButton;
