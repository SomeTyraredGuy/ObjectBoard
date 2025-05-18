import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from "@/shadcn/components/ui/dialog";
import { Input } from "@/shadcn/components/ui/input";
import { Textarea } from "@/shadcn/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { Button } from "@/shadcn/components/ui/button";
import UseCustomMutation from "@/hooks/UseCustomMutation";
import useNotification from "@/hooks/useNotification";
import { Separator } from "@/shadcn/components/ui/separator";

type Props = {
	open: boolean;
	closeFn: () => void;
	modifiable: boolean;
	board: {
		name: string;
		description: string;
	};
	refetchBoard: () => void;
};

function EditBoard({ open, closeFn, board, modifiable, refetchBoard }: Props) {
	const { t } = useTranslation();
	const { mutate, error, isError, isSuccess } = UseCustomMutation({
		path: "",
		refetchFn: refetchBoard,
		method: "PUT",
	});
	useNotification({
		isError,
		error,
		isSuccess,
		successMessage: t("board.board_menu.edit_success_message"),
	});
	const [updated, setUpdated] = React.useState(board);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setUpdated((prev) => ({ ...prev, [name]: value }));
	};
	const handleReset = () => {
		setUpdated(board);
	};

	return (
		<Dialog open={open}>
			<DialogContent closeFn={closeFn} className="px-10">
				<DialogTitle className="text-center text-2xl">
					{modifiable ? (
						<Input
							name="name"
							placeholder={t("board.board_menu.name_placeholder")}
							value={updated.name}
							onChange={handleChange}
							className="mb-2 text-center !text-2xl"
						/>
					) : (
						updated.name
					)}
				</DialogTitle>
				<Separator className="my-2" />
				<DialogDescription>{t("board.board_menu.description_label")}</DialogDescription>
				{modifiable ? (
					<>
						<Textarea
							name="description"
							placeholder={t("board.board_menu.description_placeholder")}
							value={updated.description}
							onChange={handleChange}
							className="mb-2 w-full"
						/>
						<DialogFooter className="!justify-center">
							<Button className="w-26" onClick={() => mutate(updated)}>
								{t("common.actions.save")}
							</Button>
							<Button className="w-26" onClick={handleReset}>
								{t("common.actions.reset")}
							</Button>
						</DialogFooter>
					</>
				) : (
					updated.description
				)}
			</DialogContent>
		</Dialog>
	);
}

export default EditBoard;
