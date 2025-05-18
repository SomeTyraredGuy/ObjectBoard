import ROUTES from "@/routes";
import { Button } from "@/shadcn/components/ui/button";
import { ArrowRight, RocketIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

function CallToActionSection() {
	const { t } = useTranslation("translation", { keyPrefix: "home" });
	return (
		<section className="py-24 md:py-32">
			<div className="container mx-auto px-6 text-center">
				<RocketIcon className="text-primary mx-auto mb-6 h-16 w-16" />
				<h2 className="mb-6 text-4xl font-bold md:text-5xl">{t("call_to_action.title")}</h2>
				<p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg">{t("call_to_action.text")}</p>
				<Button asChild size="lg" className="group px-8 py-3 text-lg">
					<Link to={ROUTES.signUp()}>
						{t("button_sign_up")}
						<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
					</Link>
				</Button>
			</div>
		</section>
	);
}

export default CallToActionSection;
