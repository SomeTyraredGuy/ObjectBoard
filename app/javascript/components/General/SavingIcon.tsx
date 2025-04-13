import React from "react";
import CheckSVG from "../svg/CheckSVG";
import classes from "./general.module.css";

type Props = {
	unsavedChanges: boolean;
};

function SavingIcon({ unsavedChanges }: Props) {
	return (
		<>
			<div className={`${unsavedChanges && "spinner-border opacity-50"}`} style={{ width: "26px", height: "26px" }}>
				<CheckSVG width={26} className={`${unsavedChanges && "visually-hidden"}`} />
			</div>
			<span className={`${classes.hint} ${classes.bottomHint}`}>{unsavedChanges ? "Saving" : "Changes saved"}</span>
		</>
	);
}

export default SavingIcon;
