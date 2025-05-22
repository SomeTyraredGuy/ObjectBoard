import React, { useState } from "react";
import Layout from "../Layout/Layout";
import UseCustomQuery from "../../hooks/UseCustomQuery";
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/components/ui/tabs";
import { Board } from "@/Types/Board";
import ROUTES from "@/routes";
import BoardsTab from "./Tabs/BoardsTab";
import InvitesTab from "./Tabs/InvitesTab";
import NewBoardTab from "./Tabs/NewBoardTab";
import { useTranslation } from "react-i18next";
import { LayoutGridIcon, MailIcon, PlusSquareIcon } from "lucide-react";

function Boards() {
	const { t } = useTranslation("translation", { keyPrefix: "board" });

	const {
		data: boardsData = [],
		isLoading,
		isError,
		error,
	} = UseCustomQuery({
		queryKey: ["boards"],
		path: ROUTES.boardsApi(),
	});
	const boards: Board[] = boardsData || [];

	const [activeTab, setActiveTab] = useState("boards");
	const handleNavigateToTab = (tabValue: string) => {
		setActiveTab(tabValue);
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 md:px-6">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="mb-6 flex w-4/5 self-center sm:flex-row">
						<TabsTrigger value="boards" className="button-hover">
							{t("my_boards.label")}
							<LayoutGridIcon className="ml-2 size-5" />
						</TabsTrigger>
						<TabsTrigger value="invites" className="button-hover">
							{t("invites")}
							<MailIcon className="ml-2 size-5" />
						</TabsTrigger>
						<TabsTrigger value="new" className="button-hover">
							{t("new_board.label")}
							<PlusSquareIcon className="ml-2 size-5" />
						</TabsTrigger>
					</TabsList>

					<BoardsTab
						boards={boards}
						isLoading={isLoading}
						isError={isError}
						error={error}
						onNavigateToTab={handleNavigateToTab}
					/>

					<InvitesTab />

					<NewBoardTab />
				</Tabs>
			</div>
		</Layout>
	);
}

export default Boards;
