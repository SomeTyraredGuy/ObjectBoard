import React, { useState, FormEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import UseCustomMutation from "@/hooks/UseCustomMutation";
import ROUTES from "@/routes";

type FieldType = "name" | "email" | "password";

type Props = {
	labelKey: string;
	fieldType: FieldType;
	initialValue?: string;
	refetchUser: () => void; // To refresh user data in parent context
};

function ProfileField({ labelKey, fieldType, initialValue = "", refetchUser }: Props) {
	const { t } = useTranslation();
	const [isEditing, setIsEditing] = useState(false);
	const [value, setValue] = useState(initialValue);
	const [currentPassword, setCurrentPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");

	useEffect(() => {
		if (!isEditing) {
			setValue(initialValue);
			setCurrentPassword("");
		}
	}, [isEditing]);

	const { mutate: updateField, isPending: isSaving } = UseCustomMutation({
		path: ROUTES.UserApi(),
		method: "PATCH",
		onSuccess: () => {
			refetchUser();
			setIsEditing(false);
		},
	});

	const handleEdit = () => {
		setIsEditing(true);
		setValue(initialValue);
		if (fieldType === "password") {
			setCurrentPassword("");
			setPasswordConfirmation("");
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		if (fieldType !== "password") setValue(initialValue);
	};

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		let payload;

		if (fieldType === "name" || fieldType === "email") {
			payload = {
				user: { [fieldType]: value, current_password: currentPassword },
			};
		} else {
			payload = {
				user: {
					current_password: currentPassword,
					password: value,
					password_confirmation: passwordConfirmation,
				},
			};
		}

		updateField(payload);
	};

	return (
		<div className="space-y-1 py-2">
			<Label className="text-foreground text-sm font-medium">{t(labelKey)}</Label>
			{isEditing ? (
				<form onSubmit={handleFormSubmit} className="border-border my-2 space-y-3 rounded-md border p-3">
					<div className="space-y-2">
						<Input
							type={fieldType === "name" ? "text" : fieldType}
							placeholder={t(labelKey)}
							value={value}
							onChange={(e) => setValue(e.target.value)}
							className="bg-input"
							disabled={isSaving}
							autoFocus
						/>
						{fieldType === "password" && (
							<Input
								type="password"
								placeholder={t("users.confirm_password")}
								value={passwordConfirmation}
								onChange={(e) => setPasswordConfirmation(e.target.value)}
								className="bg-input"
								disabled={isSaving}
							/>
						)}
						<Input
							type="password"
							placeholder={t("users.current_password")}
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							className="bg-input"
							disabled={isSaving}
							autoFocus
						/>
					</div>
					<div className="flex items-center space-x-2 pt-2">
						<Button
							type="submit"
							disabled={
								isSaving ||
								value === "" ||
								value === initialValue ||
								currentPassword === "" ||
								(fieldType === "password" && passwordConfirmation === "")
							}
							size="sm"
							className="bg-primary text-primary-foreground"
						>
							{isSaving ? t("common.actions.saving") : t("common.actions.save")}
						</Button>
						<Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving} size="sm">
							{t("common.actions.cancel")}
						</Button>
					</div>
				</form>
			) : (
				<div className="flex items-center justify-between">
					<p className="text-foreground flex-grow break-all rounded-md px-3 py-2 text-base">
						{fieldType === "password" ? "••••••••" : initialValue}
					</p>
					<Button
						variant="ghost"
						onClick={handleEdit}
						size="sm"
						disabled={isSaving}
						className="button-hover ml-2 flex-shrink-0"
					>
						{t("common.actions.edit")}
					</Button>
				</div>
			)}
		</div>
	);
}

export default ProfileField;
