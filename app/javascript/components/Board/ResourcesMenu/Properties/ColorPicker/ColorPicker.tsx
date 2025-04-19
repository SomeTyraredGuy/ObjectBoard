import React, { useEffect, useState } from "react";
import ColorCircle from "./ColorCircle";

type Props = {
	value?: string;
	label: string;
	setColor: (color: string) => void;
};

function ColorPicker({ label, setColor, value }: Props) {
	const colors = ["#000000", "#ffffff", "#5dbadc", "#63ab72", "#e94e1c", "transparent"];
	function getIndex() {
		return colors.findIndex((color) => color === value);
	}
	const [selected, setSelected] = useState(getIndex() !== -1 ? getIndex() : colors.length);
	const [colorPickerValue, setColorPickerValue] = useState(getIndex() === -1 ? value : "#ffffff");
	useEffect(() => {
		let index = getIndex();
		if (index === -1) index = colors.length;
		if (index !== selected) setSelected(index);
	}, [value]);

	return (
		<div className="border-foreground/40 border-1 w-full rounded p-2">
			<span className="h-fit text-base font-medium">{label}</span>

			<div className="flex items-center justify-center gap-2">
				{colors.map((color, i) => (
					<ColorCircle
						key={i}
						color={color}
						onClick={() => {
							setSelected(i);
							setColor(color);
						}}
						selected={selected === i}
					/>
				))}

				<div className="border-foreground/40 border-l-1 h-8"></div>

				<div
					className={`border-1 border-foreground h-6 w-6 rounded-full ${selected === colors.length && "border-secondary shadow-[0_0_0_2px_black] !transition-shadow"}`}
					style={{ backgroundColor: colorPickerValue }}
				>
					<input
						type="color"
						defaultValue={colorPickerValue}
						className="h-full w-full cursor-pointer opacity-0"
						onClick={(e) => {
							setSelected(colors.length);
							const input = e.target as HTMLInputElement;
							setColor(input.value);
						}}
						onInput={(e) => {
							const input = e.target as HTMLInputElement;
							setColor(input.value);
							setColorPickerValue(input.value);
						}}
					></input>
				</div>
			</div>
		</div>
	);
}

export default ColorPicker;
