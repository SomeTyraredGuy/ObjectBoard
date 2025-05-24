import { Textarea } from "@/shadcn/components/ui/textarea";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	label?: string;
	text: string;
	onChange: (text: string) => void;
};

function TextInput({ label, text, onChange }: Props) {
	const { t } = useTranslation();
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value;
		if (newValue === "") return;

		onChange(newValue);
	};

	return (
		<div className="border-foreground/40 border-1 w-full rounded p-2">
			{label && <p className="h-fit text-base font-medium">{label}</p>}
			<Textarea
				defaultValue={text}
				onChange={handleChange}
				placeholder={t("common.type_here")}
				className="mt-2 w-full resize-none"
			/>
		</div>
	);
}

export default TextInput;
