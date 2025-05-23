import React from "react";
import { useTranslation } from "react-i18next";

const mail = "example@mail.com";

function Footer() {
	const { t } = useTranslation("translation", { keyPrefix: "layouts.footer" });
	return (
		<footer className="border-border/50 border-t py-8">
			<div className="container mx-auto flex flex-col items-center justify-between gap-20 px-4 text-sm md:flex-row">
				<div className="flex flex-1 justify-center md:justify-end">
					<span className="text-primary text-5xl font-bold tracking-tight md:text-3xl">ObjectBoard</span>
				</div>
				<div className="flex flex-1 justify-center md:justify-start">
					<span className="text-muted-foreground text-base">
						{t("contact")}
						<a href={`mailto:${mail}`} className="hover:text-primary underline">
							{mail}
						</a>
					</span>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
