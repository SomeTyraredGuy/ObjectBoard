import React from "react";
import { ArrowRight, PresentationIcon } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/shadcn/components/ui/button";

function NotFoundPage() {
	const { t } = useTranslation("translation", { keyPrefix: "not_found" });
	return (
		<div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
			<div className="mb-8 flex items-center">
				<PresentationIcon className="text-primary mr-4 h-16 w-16" />
				<h1 className="text-primary text-5xl font-bold">ObjectBoard</h1>
			</div>
			<div className="text-center">
				<h2 className="text-muted-foreground text-9xl font-bold">404</h2>
				<p className="mb-8 mt-4 text-2xl font-light md:text-3xl">{t("title")}</p>
				<p className="mb-8 text-lg">{t("message")}</p>
				<Button asChild size="lg" className="group px-8 py-6 text-lg">
					<Link to="/">
						{t("go_home")}
						<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
					</Link>
				</Button>
			</div>
		</div>
	);
}

export default NotFoundPage;
