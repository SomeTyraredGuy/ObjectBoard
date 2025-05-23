import React from "react";
import { useTranslation } from "react-i18next";
import { PlusSquareIcon, EditIcon, UsersRoundIcon, CheckCircleIcon } from "lucide-react";
import { Card, CardContent } from "@/shadcn/components/ui/card";

function HowItWorksSection() {
	const { t } = useTranslation("translation", { keyPrefix: "home.how_it_works" });
	const howItWorksSteps = [
		{
			icon: <PlusSquareIcon className="text-primary mb-4 h-12 w-12" />,
			title: t("step_1_title"),
			description: t("step_1_text"),
		},
		{
			icon: <EditIcon className="text-primary mb-4 h-12 w-12" />,
			title: t("step_2_title"),
			description: t("step_2_text"),
		},
		{
			icon: <UsersRoundIcon className="text-primary mb-4 h-12 w-12" />,
			title: t("step_3_title"),
			description: t("step_3_text"),
		},
		{
			icon: <CheckCircleIcon className="text-primary mb-4 h-12 w-12" />,
			title: t("step_4_title"),
			description: t("step_4_text"),
		},
	];

	return (
		<section className="py-20 md:py-28">
			<div className="container mx-auto px-6">
				<h2 className="mb-20 text-center text-4xl font-bold md:text-5xl">{t("title")}</h2>
				<div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
					{howItWorksSteps.map((step, index) => (
						<Card
							key={index}
							className="border-border/25 flex flex-col items-center text-center shadow-lg transition-shadow duration-300 hover:shadow-2xl"
						>
							<CardContent className="flex flex-col items-center py-10">
								{step.icon}
								<h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
								<p className="text-muted-foreground text-md">{step.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

export default HowItWorksSection;
