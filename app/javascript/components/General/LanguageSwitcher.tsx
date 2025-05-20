import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shadcn/components/ui/hover-card";
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
		<HoverCard>
			<HoverCardTrigger
				className={`bg-background shadow-xs hover:bg-primary hover:text-secondary inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border text-sm font-medium transition-all ${className}`}
			>
				<LanguageSVG className="size-3/5" />
			</HoverCardTrigger>
			<HoverCardContent side={side} className="w-auto p-2">
				<div className="flex flex-col">
					{languages.map((lang, i) => (
						<Button
							key={i}
							variant="outline"
							className="bg-background hover:bg-primary hover:text-secondary my-1"
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
			</HoverCardContent>
		</HoverCard>
	);
}

export default LanguageSwitcher;
