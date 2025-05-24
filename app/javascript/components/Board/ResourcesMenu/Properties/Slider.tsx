import React from "react";
import NumberInput from "@/components/General/Inputs/NumberInput";
import { Slider as SliderComponent } from "@/shadcn/components/ui/slider";

type Props = {
	min: number;
	max?: number;
	value: number;
	multiply100?: boolean;
	step?: number;
	units?: string;
	label?: string;
	onChange: (value: number) => void;
};

function Slider({ min, max, value, step = 1, multiply100 = false, units, label, onChange }: Props) {
	return (
		<div className="border-foreground/40 border-1 w-full rounded p-2">
			{label && <p className="h-fit text-base font-medium">{label}</p>}
			<div className="mt-2 flex items-center gap-2">
				<SliderComponent
					min={min}
					max={max}
					step={step}
					value={[value]}
					onValueChange={(valueArray) => {
						onChange(valueArray[0]);
					}}
				/>
				<NumberInput
					min={min}
					max={max}
					step={step}
					value={value}
					units={units}
					multiply100={multiply100}
					onChange={onChange}
				/>
			</div>
		</div>
	);
}

export default Slider;
