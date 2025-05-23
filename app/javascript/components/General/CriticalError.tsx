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
					<span className="block text-lg font-medium opacity-65">{when}</span>
				</DialogTitle>
				<DialogDescription className="mb-4 mt-2 text-center text-lg font-medium">
					{t("message", { message })}
				</DialogDescription>
				<Separator />
				<span className="text-muted-foreground text-center text-sm">{t("reload_message")}</span>
			</DialogContent>
		</Dialog>
	);
}

export default CriticalError;
