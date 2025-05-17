import IconButton from "@/components/General/IconButton";
import { TrashSVG } from "@/components/svg/ResourcesSVG";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	deleteSelectedObjects: () => void;
};

function Actions({ deleteSelectedObjects }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "common.actions" });
	return (
		<div className="border-foreground/40 border-1 w-full rounded p-2">
			<span className="h-fit text-base font-medium">{t("label")}</span>
			<div className="mt-2 flex w-full items-center justify-start gap-4">
				<IconButton icon={TrashSVG} label={t("delete")} side="bottom" onClick={deleteSelectedObjects} />
			</div>
		</div>
	);
}

export default Actions;
