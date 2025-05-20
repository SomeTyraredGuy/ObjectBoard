import ROUTES from "@/routes";
import { Button } from "@/shadcn/components/ui/button";
import { ArrowRight, PresentationIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useUser } from "@/components/General/UserContext";

function HeroSection() {
	const { t } = useTranslation();
	const { currentUser } = useUser();

	return (
		<section className="mx-auto flex flex-col items-center justify-center gap-8 px-6 py-24 text-center md:flex-row md:text-left">
			<div className="flex w-full flex-shrink-0 justify-center md:w-auto md:justify-start">
				<PresentationIcon className="text-primary h-32 w-32 drop-shadow-lg md:h-48 md:w-48" />
			</div>
			<div className="flex w-full max-w-3xl flex-col items-center md:items-start">
				<h1 className="text-primary mb-8 text-5xl font-bold tracking-tight md:text-7xl">ObjectBoard</h1>
				<p className="text-muted-foreground mb-6 text-lg md:text-xl">{t("home.general_description")}</p>
				<p className="text-md text-muted-foreground mb-12 md:text-lg">{t("home.additional_description")}</p>
				<Button asChild size="lg" className="group px-8 py-6 text-lg">
					{currentUser ? (
						<Link to={ROUTES.boards()}>
							{t("common.pages.to_boards")}
							<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
						</Link>
					) : (
						<Link to={ROUTES.signUp()}>
							{t("home.button_sign_up")}
							<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
						</Link>
					)}
				</Button>
			</div>
		</section>
	);
}

export default HeroSection;
