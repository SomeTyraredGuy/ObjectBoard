import React from "react";
import { CanvasMode, CanvasState } from "../../../../Types/Canvas";
import { PaletteSVG } from "../../../svg/ResourcesSVG";
import ColorPicker from "./ColorPicker/ColorPicker";
import { ObjectPropertyChange } from "../../../../Types/ObjectPropertyChange";
import { CanvasObject, CanvasObjectType, numOfObjectTypes } from "../../../../Types/CanvasObjects";
import Slider from "./Slider";
import { CanvasStateUtils } from "../../../../Types/CanvasStateUtils";
import Actions from "./Actions";
import { useTranslation } from "react-i18next";
import { UseCanvasState } from "../../CanvasStateContext";

function getDefaultProperties(canvasState: CanvasState): Partial<CanvasObject> {
	if (canvasState.mode === CanvasMode.Inserting) {
		return canvasState.startingProperties;
	}

	if (canvasState.mode !== CanvasMode.Selected) return {};
	const foundTypes: CanvasObjectType[] = [];
	let defaultProperties = {};

	for (const object of canvasState.objects) {
		if (!object) continue;

		if (!foundTypes.includes(object.type)) {
			foundTypes.push(object.type);
			defaultProperties = {
				...defaultProperties,
				...object,
			};
		}

		if (foundTypes.length === numOfObjectTypes) break;
	}

	return defaultProperties;
}

type Props = {
	resourcesProperties: {
		changeProperty: (ObjectPropertyChange) => void;
		deleteSelectedObjects: () => void;
	};
};

function ObjectsProperties({ resourcesProperties }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "board.resources_menu.properties" });
	const { canvasState, canvasStateUtils } = UseCanvasState();

	if (canvasState.mode !== CanvasMode.Selected && canvasState.mode !== CanvasMode.Inserting)
		return (
			<div className="flex h-full flex-col items-center justify-center p-5">
				<PaletteSVG className="w-5/6" />
				<p className="p-2 text-center text-2xl">{t("no_objects")}</p>
			</div>
		);

	const { changeProperty, deleteSelectedObjects } = resourcesProperties;

	const setProperty = <P extends ObjectPropertyChange["propertyName"]>(propertyName: P) => {
		return (value: Extract<ObjectPropertyChange, { propertyName: P }>["newValue"]) => {
			if (canvasState.mode === CanvasMode.Inserting) {
				canvasStateUtils.Inserting.updateProperty(propertyName, value);
			}
			if (canvasState.mode === CanvasMode.Selected) {
				changeProperty({
					propertyName: propertyName,
					newValue: value,
				});
			}
		};
	};

	const defaultProperties = getDefaultProperties(canvasState);

	const colorPickers = [
		"fill" in defaultProperties && {
			label: t("fill_color"),
			value: defaultProperties.fill,
			setColor: setProperty("fill"),
		},
		"stroke" in defaultProperties && {
			label: t("stroke_color"),
			value: defaultProperties.stroke,
			setColor: setProperty("stroke"),
		},
	];
	const sliders = [
		"strokeWidth" in defaultProperties && {
			label: t("stroke_width"),
			value: defaultProperties.strokeWidth,
			min: 0,
			max: 50,
			step: 1,
			multiply100: false,
			units: null,
			onChange: setProperty("strokeWidth"),
		},
		"opacity" in defaultProperties && {
			label: t("opacity"),
			value: defaultProperties.opacity,
			min: 0.1,
			max: 1,
			step: 0.01,
			multiply100: true,
			units: "%",
			onChange: setProperty("opacity"),
		},
		"cornerRadius" in defaultProperties && {
			label: t("corner_radius"),
			value: defaultProperties.cornerRadius,
			min: 0,
			max: 0.5,
			step: 0.01,
			multiply100: true,
			units: "%",
			onChange: setProperty("cornerRadius"),
		},
	];

	return (
		<div className={`flex flex-1 flex-col items-start gap-2 overflow-y-auto p-3`}>
			{canvasState.mode === CanvasMode.Selected && <Actions deleteSelectedObjects={deleteSelectedObjects} />}

			{colorPickers.map((colorPicker) => {
				if (!colorPicker) return null;

				return (
					<ColorPicker
						key={colorPicker.label}
						label={colorPicker.label}
						value={colorPicker.value}
						setColor={colorPicker.setColor}
					/>
				);
			})}

			{sliders.map((slider) => {
				if (!slider) return null;

				return (
					<Slider
						key={slider.label}
						min={slider.min}
						max={slider.max}
						step={slider.step}
						label={slider.label}
						value={slider.value}
						multiply100={slider.multiply100}
						units={slider.units}
						onChange={slider.onChange}
					/>
				);
			})}
		</div>
	);
}

export default ObjectsProperties;
