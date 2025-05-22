import ROUTES from "@/routes";
import { Button } from "@/shadcn/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/components/ui/popover";
import { Board } from "@/Types/Board";
import React from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

type Props = {
	board: Board;
};

function BoardCard({ board }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "board" });

	return (
		<Card key={board.id} className="content-around1">
			<CardHeader>
				<CardTitle className="truncate">{board.name}</CardTitle>
				<CardDescription>{t("members_menu.role." + board.role)}</CardDescription>
			</CardHeader>
			<CardContent className="h-full">
				{board.description && (
					<Popover>
						<PopoverTrigger asChild>
							<CardDescription className="line-clamp-2 cursor-pointer">
								{board.description}
							</CardDescription>
						</PopoverTrigger>
						<PopoverContent className="w-80">
							<p>{board.description}</p>
						</PopoverContent>
					</Popover>
				)}
			</CardContent>
			<CardFooter>
				<Button variant="outline" size="sm" className="button-hover w-full" asChild>
					<Link to={ROUTES.board(board.id)}>{t("open")}</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}

export default BoardCard;
