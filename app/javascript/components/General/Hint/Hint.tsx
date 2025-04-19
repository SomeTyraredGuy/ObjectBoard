import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shadcn/components/ui/hover-card";
import { Separator } from "@/shadcn/components/ui/separator";
import React from "react";

type Props = {
	children: React.ReactNode;
	title?: string;
	description?: string;
	side?: "top" | "bottom" | "left" | "right";
	href?: string;
	className?: string;
};

function Hint({ children, title, description, side = "bottom", href, className }: Props) {
	return (
		<HoverCard>
			<HoverCardTrigger href={href} className={className}>
				{children}
			</HoverCardTrigger>
			<HoverCardContent side={side} className="w-auto">
				<div className="flex flex-col">
					{title && <h2 className="text-sm font-semibold">{title}</h2>}
					{title && description && <Separator className="my-2" />}
					{description && <p className="text-muted-foreground text-sm">{description}</p>}
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}

export default Hint;
