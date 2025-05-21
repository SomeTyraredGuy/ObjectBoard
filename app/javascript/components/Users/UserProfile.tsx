import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../General/UserContext";
import { Button } from "@/shadcn/components/ui/button";
import { useTranslation } from "react-i18next";
import ROUTES from "@/routes";
import ProfileField from "./ProfileField";
import Loader from "../General/Loader";
import DeleteProfileDialog from "./DeleteProfileDialog";
import Layout from "../Layout/Layout";

function UserProfile() {
	const { currentUser, isLoading: isUserLoading, error: userLoadingError, refetchUser } = useUser();
	const navigate = useNavigate();
	const { t } = useTranslation("translation", { keyPrefix: "users" });
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	useEffect(() => {
		if (!isUserLoading && (userLoadingError || !currentUser)) {
			navigate(ROUTES.signIn());
		}
	}, [currentUser, userLoadingError, isUserLoading, navigate]);

	if (isUserLoading || !currentUser || userLoadingError) {
		return <Loader />;
	}

	return (
		<Layout>
			<div className="mx-auto max-w-2xl px-4 py-8">
				<div className="mb-8 text-center">
					<h1 className="text-primary mb-2 text-4xl font-bold tracking-tight">ObjectBoard</h1>
					<h2 className="text-foreground mb-2 text-3xl font-semibold">{t("edit_profile")}</h2>
					<p className="text-muted-foreground text-lg">{t("edit_profile_label")}</p>
				</div>

				<div className="divide-border mt-2 space-y-1 divide-y">
					<ProfileField
						labelKey="users.name"
						fieldType="name"
						initialValue={currentUser.name}
						refetchUser={refetchUser}
					/>
					<ProfileField
						labelKey="users.email"
						fieldType="email"
						initialValue={currentUser.email}
						refetchUser={refetchUser}
					/>
					<ProfileField labelKey="users.password" fieldType="password" refetchUser={refetchUser} />
				</div>

				<div className="border-border border-t pt-6">
					<div className="border-destructive bg-card rounded-lg border p-4">
						<div className="flex items-center justify-between">
							<div className="pr-2">
								<h4 className="text-destructive font-semibold">{t("delete_account")}</h4>
								<p className="text-muted-foreground text-sm">{t("delete_account_label")}</p>
							</div>
							<Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
								{t("delete_account")}
							</Button>
						</div>
					</div>
				</div>
			</div>
			<DeleteProfileDialog isOpen={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
		</Layout>
	);
}

export default UserProfile;
