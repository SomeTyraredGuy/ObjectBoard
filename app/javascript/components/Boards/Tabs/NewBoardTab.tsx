import { TabsContent } from "@/shadcn/components/ui/tabs";
import React, { useState } from "react";
import UseCustomMutation from "@/hooks/UseCustomMutation";
import ROUTES from "@/routes";
import { useTranslation } from "react-i18next";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Textarea } from "@/shadcn/components/ui/textarea";
import { Label } from "@/shadcn/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/components/ui/card";

type Props = {
	refetchBoards: () => void;
	onNavigateToTab: (tabValue: string) => void;
};

function NewBoardTab({ refetchBoards, onNavigateToTab }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "board" });
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const { mutate: createBoard, isPending: isCreatingBoard } = UseCustomMutation({
		path: ROUTES.createBoardApi(),
		method: "POST",
		onSuccess: () => {
			setName("");
			setDescription("");
			refetchBoards();
			onNavigateToTab("boards");
		},
		successMessage: t("successfully_created"),
	});

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		createBoard({ name, description });
	};

	return (
		<TabsContent value="new">
			<div className="flex justify-center">
				<Card className="w-full max-w-lg shadow-lg">
					<CardHeader>
						<CardTitle className="text-center">{t("new_board.title")}</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<Label htmlFor="board-name" className="mb-2 block text-sm font-medium">
									{t("new_board.name")}
								</Label>
								<Input
									type="text"
									id="board-name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder={t("new_board.name_placeholder")}
									maxLength={25}
									required
									className="w-full"
								/>
							</div>
							<div>
								<Label htmlFor="board-description" className="mb-2 block text-sm font-medium">
									{t("new_board.description")}
								</Label>
								<Textarea
									id="board-description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder={t("new_board.description_placeholder")}
									maxLength={255}
									rows={4}
									required
									className="w-full resize-none"
								/>
							</div>
							<Button type="submit" disabled={isCreatingBoard} className="w-full">
								{isCreatingBoard ? t("new_board.creating") : t("new_board.create")}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</TabsContent>
	);
}

export default NewBoardTab;
