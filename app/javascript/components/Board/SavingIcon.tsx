import React from "react";
import CheckSVG from "../svg/CheckSVG";
import Hint from "../General/Hint/Hint";
import { useTranslation } from "react-i18next";

type Props = {
	unsavedChanges: boolean;
};

function SavingIcon({ unsavedChanges }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "board.board_menu" });
	return (
		<Hint description={unsavedChanges ? t("saving") : t("saved")} side="bottom">
			{unsavedChanges ? (
				<div className="border-t-primary h-8 w-8 animate-spin rounded-full border-4 border-gray-300"></div>
			) : (
				<CheckSVG className="size-8" />
			)}
		</Hint>
	);
}

export default SavingIcon;
