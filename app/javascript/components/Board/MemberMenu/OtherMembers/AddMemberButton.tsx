import PlusCircleSVG from "@/components/svg/PlusCircleSVG";
import { Button } from "@/shadcn/components/ui/button";
import React from "react";

type Props = {
	toggleAddMemberMenu: () => void;
	className?: string;
};

function AddMemberButton({ toggleAddMemberMenu, className }: Props) {
	return (
		<Button
			onClick={toggleAddMemberMenu}
			variant="ghost"
			className={`hover:bg-primary group flex w-full items-center justify-center ${className}`}
		>
			<PlusCircleSVG className="group-hover:text-secondary size-10" />
		</Button>
	);
}

export default AddMemberButton;
