import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/components/ui/popover";
import LanguageSVG from "../svg/LanguageSVG";
import { useTranslation } from "react-i18next";
import { Button } from "@/shadcn/components/ui/button";
import { getFullURL } from "@/scripts/requestUtils";

type Props = {
	side?: "top" | "bottom" | "left" | "right";
	className?: string;
};

function LanguageSwitcher({ side = "bottom", className }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "common.locales" });
	const languages = [
		{ code: "en", label: t("en") },
		{ code: "uk", label: t("uk") },
	];

	return (
		<Popover>
			<PopoverTrigger
				className={`bg-background shadow-xs button-hover inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border text-sm font-medium transition-all ${className}`}
			>
				<LanguageSVG className="size-3/5" />
			</PopoverTrigger>
			<PopoverContent side={side} className="w-auto p-2">
				<div className="flex flex-col">
					{languages.map((lang, i) => (
						<Button
							key={i}
							variant="outline"
							className="bg-background button-hover my-1"
							onClick={() => {
								let url = getFullURL();
								if (/\/(en|uk)(\/|$)/.test(url)) {
									url = url.replace(/\/(en|uk)(\/|$)/, `/${lang.code}$2`);
								} else {
									url = url.replace(/(https?:\/\/[^/]+)(\/?)/, `$1/${lang.code}/`);
								}
								window.location.href = url;
							}}
						>
							{lang.label}
						</Button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default LanguageSwitcher;
