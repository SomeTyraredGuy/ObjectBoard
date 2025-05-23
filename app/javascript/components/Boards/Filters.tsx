import { Button } from "@/shadcn/components/ui/button";
import { Label } from "@/shadcn/components/ui/label";
import { Separator } from "@/shadcn/components/ui/separator";
import { Board } from "@/Types/Board";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/components/ui/popover";
import { Switch } from "@/shadcn/components/ui/switch";
import { Filter } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

export type FilterType = {
	label: string;
	func: (board: Board) => boolean;
};

type Props = {
	addFilter: (filter: FilterType) => void;
	removeFilter: (filter: FilterType) => void;
};

function Filters({ addFilter, removeFilter }: Props) {
	const FILTERABLE_ROLES = ["Owner", "Admin", "Editor", "Viewer"];
	const { t } = useTranslation("translation", { keyPrefix: "board" });
	const filters = FILTERABLE_ROLES.map((role) => {
		return {
			label: role,
			func: (board: Board) => board.role === role,
		};
	});

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" className="button-hover w-full cursor-pointer sm:w-auto">
					<Filter className="mr-2 h-4 w-4" /> {t("search.filters")}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-56">
				<div className="space-y-4">
					<p className="mt-1 text-center text-base font-medium leading-none">{t("search.filter_by_role")}</p>
					<Separator />
					{filters.map((filter) => (
						<div key={filter.label} className="flex items-center justify-between space-x-2">
							<Label htmlFor={`role-${filter.label}`} className="capitalize">
								{t(`members_menu.role.${filter.label}`)}
							</Label>
							<Switch
								onCheckedChange={(checked) => {
									if (checked) {
										addFilter(filter);
									} else {
										removeFilter(filter);
									}
								}}
							/>
						</div>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default Filters;
