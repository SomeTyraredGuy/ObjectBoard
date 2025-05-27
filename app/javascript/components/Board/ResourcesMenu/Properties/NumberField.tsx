import NumberInput from "@/components/General/Inputs/NumberInput";
import React from "react";

type Props = {
	min?: number;
	max?: number;
	value: number;
	multiply100?: boolean;
	step?: number;
	units?: string;
	label?: string;
	onChange: (value: number) => void;
	rounded?: boolean;
};

function NumberField({ min, max, value, step = 1, multiply100 = false, units, label, onChange, rounded }: Props) {
	return (
		<div className="border-foreground/40 border-1 w-full rounded p-2">
			{label && <p className="h-fit text-base font-medium">{label}</p>}
			<div className="mt-2 flex items-center gap-2">
				<NumberInput
					min={min}
					max={max}
					step={step}
					value={value}
					units={units}
					multiply100={multiply100}
					onChange={onChange}
					className="w-full"
					inputClassName="w-full"
					rounded={rounded}
				/>
			</div>
		</div>
	);
}

export default NumberField;
