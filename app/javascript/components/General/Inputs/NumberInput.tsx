import React from "react";

type Props = {
	min: number;
	max: number;
	step?: number;
	value: number;
	units?: string;
	multiply100?: boolean;
	onChange: (value: number) => void;
};

function NumberInput({ min, max, step = 1, value, units, multiply100 = false, onChange }: Props) {
	const handleChange = (e) => {
		const input = e.target as HTMLInputElement;

		let value = parseFloat(input.value);
		if (isNaN(value)) return;
		if (multiply100) value = value / 100;
		if (value < min) value = min;
		if (value > max) value = max;
		onChange(value);
	};

	return (
		<div className="border-foreground/20 border-1 flex items-center gap-1 rounded-2xl p-1">
			<input
				type="number"
				min={multiply100 ? Math.round(min * 100) : min}
				max={multiply100 ? Math.round(max * 100) : max}
				step={multiply100 ? Math.round(step * 100) : step}
				value={multiply100 ? Math.round(value * 100) : value}
				onChange={handleChange}
				className="w-10 rounded text-center font-medium"
			/>
			{units && <p className="h-fit pr-1 text-base font-medium">{units}</p>}
		</div>
	);
}

export default NumberInput;
