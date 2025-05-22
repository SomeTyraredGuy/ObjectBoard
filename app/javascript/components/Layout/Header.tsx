import React from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/shadcn/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";
import { LayoutGridIcon, LogInIcon, LogOutIcon, PresentationIcon, UserCircleIcon, UserPlusIcon } from "lucide-react";
import LanguageSwitcher from "../General/LanguageSwitcher";
import ROUTES from "@/routes";
import UseCustomMutation from "@/hooks/UseCustomMutation";
import { useUser } from "@/components/General/UserContext";

function Header() {
	const { t } = useTranslation();
	const { currentUser, refetchUser } = useUser();
	const { mutate: signOut } = UseCustomMutation({
		path: ROUTES.signOutApi(),
		method: "DELETE",
		onResponse: refetchUser,
	});

	return (
		<header className="bg-background/80 border-border/60 custom-blur sticky top-0 z-50 w-full border-b backdrop-blur">
			<div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-4">
					<Link to={ROUTES.home()} className="flex items-center gap-2 text-lg font-semibold">
						<PresentationIcon className="text-primary mt-1 h-8 w-8" />
						<span className="text-primary text-3xl font-bold tracking-tight">ObjectBoard</span>
					</Link>
					{currentUser && (
						<nav className="flex items-center">
							<Button variant="ghost" asChild>
								<Link to={ROUTES.boards()} className="button-hover shadow-xs">
									<LayoutGridIcon className="size-6" />
									<span className="text-base">{t("common.pages.boards")}</span>
								</Link>
							</Button>
						</nav>
					)}
				</div>
				<div className="flex items-center gap-2">
					{currentUser ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="button-hover shadow-xs flex items-center gap-2">
									<UserCircleIcon className="size-6" />
									<span className="hidden text-base sm:inline">{currentUser.name}</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>{t("users.my_profile")}</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link to={ROUTES.profile()}>
										<UserCircleIcon className="mr-2 h-4 w-4" />
										{t("users.to_profile")}
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Button
										onClick={() => {
											signOut("");
										}}
										className="w-full text-left"
									>
										<LogOutIcon className="mr-2 h-4 w-4" />
										{t("users.logout")}
									</Button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<>
							<Button variant="outline" asChild className="button-hover shadow-xs border-border/0">
								<Link to={ROUTES.signIn()}>
									<LogInIcon className="mr-2 h-4 w-4" />
									{t("users.login")}
								</Link>
							</Button>
							<Button asChild className="hover:bg-secondary hover:text-primary">
								<Link to={ROUTES.signUp()}>
									<UserPlusIcon className="mr-2 h-4 w-4" />
									{t("users.sign_up")}
								</Link>
							</Button>
						</>
					)}
					<LanguageSwitcher side="bottom" className="border-border/0 size-10" />
				</div>
			</div>
		</header>
	);
}

export default Header;
