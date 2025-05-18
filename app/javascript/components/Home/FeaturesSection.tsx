import React from "react";
import { GitCompareArrowsIcon, KeyRoundIcon, Settings, ShieldCheck, UsersIcon, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/components/ui/card";
import { useTranslation } from "react-i18next";

function FeaturesSection() {
	const { t } = useTranslation("translation", { keyPrefix: "home.key_features" });
	const iconClassName = "text-primary h-8 w-8";
	const features = [
		{
			icon: <Zap className={iconClassName} />,
			title: t("1_title"),
			description: t("1_text"),
		},
		{
			icon: <Settings className={iconClassName} />,
			title: t("2_title"),
			description: t("2_text"),
		},
		{
			icon: <ShieldCheck className={iconClassName} />,
			title: t("3_title"),
			description: t("3_text"),
		},
		{
			icon: <UsersIcon className={iconClassName} />,
			title: t("4_title"),
			description: t("4_text"),
		},
		{
			icon: <KeyRoundIcon className={iconClassName} />,
			title: t("5_title"),
			description: t("5_text"),
		},
		{
			icon: <GitCompareArrowsIcon className={iconClassName} />,
			title: t("6_title"),
			description: t("6_text"),
		},
	];

	return (
		<section className="py-20 md:py-28">
			<div className="container mx-auto px-6">
				<h2 className="mb-20 text-center text-4xl font-bold md:text-5xl">{t("title")}</h2>
				<div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="border-border/25 flex flex-col shadow-lg transition-shadow duration-300 hover:shadow-2xl"
						>
							<CardHeader className="items-center pt-8 text-center">
								{feature.icon}
								<CardTitle className="mt-4 text-xl font-semibold">{feature.title}</CardTitle>
							</CardHeader>
							<CardContent className="flex-grow px-6 pb-8 text-center">
								<CardDescription className="text-md text-muted-foreground">
									{feature.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

export default FeaturesSection;
