import React, { useState } from "react";
import IconButton from "../../General/IconButton";
import { FolderSVG, PaletteSVG } from "../../svg/ResourcesSVG";
import ObjectsProperties from "./Properties/ObjectsProperties";
import ObjectsGroups from "./ObjectsGroups";
import { useTranslation } from "react-i18next";

enum State {
	Properties = "Properties",
	Groups = "Groups",
}

type Props = {
	resourcesProperties;
};

function ResourcesMenu({ resourcesProperties }: Props) {
	const [state, setState] = useState(State.Properties);
	const { t } = useTranslation("translation", { keyPrefix: "board.resources_menu.states" });

	const stateButtons = [
		{
			icon: PaletteSVG,
			onClick: () => setState(State.Properties),
			label: t("properties"),
			isActive: state === State.Properties,
		},
		{
			icon: FolderSVG,
			onClick: () => setState(State.Groups),
			label: t("groups"),
			isActive: state === State.Groups,
		},
	];

	return (
		<div className="border-standard bg-background w-74 fixed right-0 top-24 flex h-5/6 flex-col rounded-l-2xl">
			{/* <div className="border-standard justify-center-safe flex h-14 flex-shrink-0 items-center gap-4 !border-x-0 !border-t-0">
				{stateButtons.map((button, i) => (
					<IconButton
						key={i}
						icon={button.icon}
						onClick={button.onClick}
						label={button.label}
						isActive={button.isActive}
						side="top"
						className="h-10 w-10"
					/>
				))}
			</div> */}
			{/* {state === State.Properties && */ <ObjectsProperties resourcesProperties={resourcesProperties} />}

			{/* {state === State.Groups && <ObjectsGroups />} */}
		</div>
	);
}

export default ResourcesMenu;
