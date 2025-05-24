import React from "react";
import { Select } from "@/shadcn/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select";
import { useTranslation } from "react-i18next";

type Props = {
	onChange: (value: string) => void;
	defaultValue: string;
	options: string[];
	label: string;
	localizationPath: string;
};

function Selector({ label, options, onChange, defaultValue, localizationPath }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: localizationPath });
	console.log(defaultValue);

	return (
		<div className="border-foreground/40 border-1 w-full rounded p-2">
			{label && <p className="h-fit text-base font-medium">{label}</p>}
			<Select onValueChange={onChange} defaultValue={defaultValue}>
				<SelectTrigger className="w-full cursor-pointer justify-center">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{options.map((option, i) => {
						return (
							<SelectItem key={i} value={option} className="cursor-pointer justify-center">
								{t(option)}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</div>
	);
}

export default Selector;
