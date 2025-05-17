import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shadcn/components/ui/dialog";
import { Separator } from "@/shadcn/components/ui/separator";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	when: string;
	message: string;
};

function CriticalError({ when, message }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "board.critical_error" });
	setTimeout(() => {
		window.location.reload();
	}, 10000);

	return (
		<Dialog open={true}>
			<DialogContent showXButton={false}>
				<DialogTitle className="text-destructive text-center text-2xl font-bold">
					{t("title")}
					<p className="text-lg font-medium opacity-65">{when}</p>
				</DialogTitle>
				<DialogDescription className="mt-2 text-center text-sm">
					<p className="mb-4 text-lg font-medium">{t("message", { message })}</p>
					<Separator />
					<p className="text-muted-foreground text-sm">{t("reload_message")}</p>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}

export default CriticalError;
