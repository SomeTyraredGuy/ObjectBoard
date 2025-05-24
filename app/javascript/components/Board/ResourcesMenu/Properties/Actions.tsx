import IconButton from "@/components/General/IconButton";
import { TrashSVG, LockSVG } from "@/components/svg/ResourcesSVG";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	deleteSelectedObjects: () => void;
	setLocked: (newLocked: boolean) => void;
	lock: boolean;
};

function Actions({ deleteSelectedObjects, setLocked, lock }: Props) {
	const { t } = useTranslation();
	const switchLock = () => {
		setLocked(!lock);
	};

	return (
		<div className="border-foreground/40 border-1 w-full rounded p-2">
			<span className="h-fit text-base font-medium">{t("common.actions.label")}</span>
			<div className="mt-2 flex w-full items-center justify-start gap-4">
				<IconButton
					icon={TrashSVG}
					label={t("common.actions.delete")}
					side="bottom"
					onClick={deleteSelectedObjects}
				/>
				<IconButton
					icon={LockSVG}
					isActive={lock}
					label={lock ? t("board.resources_menu.actions.unlock") : t("board.resources_menu.actions.lock")}
					side="bottom"
					onClick={switchLock}
				/>
			</div>
		</div>
	);
}

export default Actions;
