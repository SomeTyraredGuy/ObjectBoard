import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Board } from "@/Types/Board";
import { TabsContent } from "@radix-ui/react-tabs";
import { Search } from "lucide-react";
import React, { useState } from "react";
import BoardCard from "../BoardCard";
import { useTranslation } from "react-i18next";
import Filters, { FilterType } from "../Filters";

type Props = {
	boards: Board[];
	isLoading: boolean;
	isError: boolean;
	error: unknown;
	onNavigateToTab: (tabValue: string) => void;
};

function BoardsTab({ boards, isLoading, isError, error, onNavigateToTab }: Props) {
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

	return (
		<TabsContent value="boards">
			<div className="flex flex-col space-y-4">
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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

				{(isLoading || isError) && (
					<div className="py-10 text-center">
						<p className={isLoading ? "text-muted-foreground" : "text-destructive"}>
							{isLoading
								? t("board.search.loading_boards")
								: error instanceof Error
									? error.message
									: t("common.notification.unexpected_error")}
						</p>
					</div>
				)}

				{!isLoading &&
					!isError &&
					(filteredBoards.length === 0 ? (
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
						<div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{filteredBoards.map((board) => (
								<BoardCard key={board.id} board={board} />
							))}
						</div>
					))}
			</div>
		</TabsContent>
	);
}

export default BoardsTab;
