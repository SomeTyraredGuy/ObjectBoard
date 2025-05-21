import React from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
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
import UseCustomMutation from "@/hooks/UseCustomMutation";
import ROUTES from "@/routes";

interface DeleteProfileDialogProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

function DeleteProfileDialog({ isOpen, onOpenChange }: DeleteProfileDialogProps) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const handleDeleteSuccess = () => {
		queryClient.invalidateQueries({ queryKey: ["user"] });
		onOpenChange(false);
		navigate(ROUTES.home());
	};

	const {
		mutate: deleteUser,
		isPending: isDeleting,
		isError,
		error,
	} = UseCustomMutation({
		path: ROUTES.UserApi(),
		method: "DELETE",
		onSuccess: handleDeleteSuccess,
	});

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="border-standard bg-card text-card-foreground sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-foreground">{t("users.delete_account")}</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						{t("common.cannot_be_undone")}
					</DialogDescription>
				</DialogHeader>
				{isError && <p className="text-destructive text-sm font-medium">{error.message}</p>}
				<DialogFooter>
					<Button variant="destructive" onClick={() => deleteUser({})} disabled={isDeleting}>
						{isDeleting ? t("common.actions.deleting") : t("users.delete_account")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default DeleteProfileDialog;
