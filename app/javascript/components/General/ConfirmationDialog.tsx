import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shadcn/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shadcn/components/ui/dialog";

interface Props {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	action: () => void;
	isPending: boolean;
	button_label: string;
}

function ConfirmationDialog({ isOpen, onOpenChange, action, isPending, button_label }: Props) {
	const { t } = useTranslation();

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="border-standard bg-card text-card-foreground sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-foreground hidden">{button_label}</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						{t("common.cannot_be_undone")}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button className="w-full" variant="destructive" onClick={action} disabled={isPending}>
						{button_label}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default ConfirmationDialog;
