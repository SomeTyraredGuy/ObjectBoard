import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { Button } from "@/shadcn/components/ui/button";
import UseCustomMutation from "@/hooks/UseCustomMutation";
import { Input } from "@/shadcn/components/ui/input";
import useNotification from "@/hooks/useNotification";
import { useTranslation } from "react-i18next";

type Props = {
	refetchFn: () => void;
	closeFn: () => void;
	open: boolean;
};

function AddMemberForm({ refetchFn, closeFn, open }: Props) {
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const {
		mutate: add,
		error,
		isError,
		isSuccess,
	} = UseCustomMutation({
		path: "/member/add_to_board",
		refetchFn: refetchFn,
		method: "POST",
	});

	useNotification({
		isError,
		error,
		isSuccess,
		successMessage: t("board.members_menu.add.success_message", { nickname: name }),
	});

	return (
		<Dialog open={open}>
			<DialogContent
				closeFn={() => {
					closeFn();
					setName("");
				}}
			>
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">{t("board.members_menu.add.label")}</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<Input
					type="text"
					placeholder={t("board.members_menu.add.placeholder")}
					onChange={(event) => setName(event.target.value)}
					className="justify-self-center-safe w-2/3"
				/>
				<DialogFooter className="!justify-center">
					<Button className="w-26" onClick={() => add(name)} disabled={name === ""}>
						{t("common.actions.add")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default AddMemberForm;
