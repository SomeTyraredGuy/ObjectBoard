import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Board } from "@/Types/Board";
import { TabsContent } from "@radix-ui/react-tabs";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import BoardsGrid from "../BoardsGrid";
import { useTranslation } from "react-i18next";
import Filters, { FilterType } from "../Filters";
import UseCustomMutation from "@/hooks/UseCustomMutation";
import ROUTES from "@/routes";

type showConfirmation = {
	action: () => void;
	boardId: number;
	label: string;
} | null;

type Props = {
	boards: Board[];
	refetchBoards: () => void;
	isLoading: boolean;
	onNavigateToTab: (tabValue: string) => void;
};

function BoardsTab({ boards, refetchBoards, isLoading, onNavigateToTab }: Props) {
	const { t } = useTranslation();

	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilters, setRoleFilters] = useState<FilterType[]>([]);
	function addFilter(filter: FilterType) {
		setRoleFilters((prevFilters) => (prevFilters ? [...prevFilters, filter] : [filter]));
	}
	function removeFilter(filter: FilterType) {
		setRoleFilters((prevFilters) => [...prevFilters.filter((f) => f.label !== filter.label)]);
	}
	const filteredBoards = boards.filter(
		(board) =>
			board.role !== "Invited" &&
			(board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				board.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
			(roleFilters.length > 0 ? roleFilters.some((filter) => filter.func(board)) : true),
	);

	const [showConfirmation, setShowConfirmation] = useState<showConfirmation>(null);
	useEffect(() => {
		setShowConfirmation(null);
	}, [boards]);

	const { mutate: deleteBoard } = UseCustomMutation({
		path: ROUTES.deleteBoardApi(showConfirmation?.boardId),
		method: "DELETE",
		onSuccess: refetchBoards,
		successMessage: t("board.successfully_deleted"),
	});

	const { mutate: leaveBoard } = UseCustomMutation({
		path: ROUTES.leaveBoardApi(showConfirmation?.boardId),
		method: "DELETE",
		onSuccess: refetchBoards,
		successMessage: t("board.successfully_left"),
	});

	return (
		<TabsContent value="boards">
			<div className="flex flex-col space-y-4">
				<div className="items-start sm:items-center">
					<h1 className="text-2xl font-semibold tracking-tight">{t("board.my_boards.label")}</h1>
				</div>

				<div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
					<div className="relative w-full flex-grow sm:w-auto">
						<Search className="text-muted-foreground absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
						<Input
							type="search"
							placeholder={t("board.search.placeholder")}
							className="w-full pl-8"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<Filters addFilter={addFilter} removeFilter={removeFilter} />
				</div>

				{isLoading && (
					<div className="py-10 text-center">
						<p className="text-muted-foreground">{t("board.search.loading_boards")}</p>
					</div>
				)}

				{!isLoading && filteredBoards.length === 0 ? (
					<div className="py-10 text-center">
						<p className="text-muted-foreground">
							{searchTerm ? t("board.search.no_boards_matching") : t("board.my_boards.no_boards")}
						</p>
						{!searchTerm && (
							<Button
								variant="outline"
								className="button-hover mt-2"
								onClick={() => onNavigateToTab("new")}
							>
								{t("board.new_board.create_first")}
							</Button>
						)}
					</div>
				) : (
					<BoardsGrid
						boards={filteredBoards}
						leaveBoard={() => leaveBoard({})}
						deleteBoard={() => deleteBoard({})}
						showConfirmation={showConfirmation}
						setShowConfirmation={setShowConfirmation}
					/>
				)}
			</div>
		</TabsContent>
	);
}

export default BoardsTab;
export type { showConfirmation };
