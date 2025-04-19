import React from "react";
import CheckSVG from "../svg/CheckSVG";
import Hint from "./Hint/Hint";

type Props = {
	unsavedChanges: boolean;
};

function SavingIcon({ unsavedChanges }: Props) {
	return (
		<Hint description={unsavedChanges ? "Saving..." : "Saved"} side="bottom">
			{unsavedChanges ? (
				<div className="border-t-primary h-8 w-8 animate-spin rounded-full border-4 border-gray-300"></div>
			) : (
				<CheckSVG className="size-8" />
			)}
		</Hint>
	);
}

export default SavingIcon;
