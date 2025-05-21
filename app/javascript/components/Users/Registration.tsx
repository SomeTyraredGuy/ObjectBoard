import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/shadcn/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/components/ui/card";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import UseCustomMutation from "@/hooks/UseCustomMutation";
import { useTranslation } from "react-i18next";
import ROUTES from "@/routes";

function Registration() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [clientError, setClientError] = useState<string | null>(null);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { t } = useTranslation("translation", { keyPrefix: "users" });

	const handleRegistrationSuccess = () => {
		queryClient.invalidateQueries({ queryKey: ["user"] });
		navigate(ROUTES.home());
	};

	const {
		mutate: registerUser,
		error: registrationApiError,
		isError: isRegistrationApiError,
		isSuccess: isRegistrationSuccess,
	} = UseCustomMutation({
		path: ROUTES.signUpApi(),
		method: "POST",
		onSuccess: handleRegistrationSuccess,
	});

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setClientError(null);

		if (password !== passwordConfirmation) {
			setClientError(t("passwords_do_not_match"));
			return;
		}

		registerUser({
			user: {
				name,
				email,
				password,
				password_confirmation: passwordConfirmation,
			},
		});
	};

	let errorMessage = null;
	if (clientError) {
		errorMessage = clientError;
	} else if (isRegistrationApiError && registrationApiError) {
		errorMessage = registrationApiError.message || t("sign_up_failed");
	}

	return (
		<div className="bg-background text-foreground flex min-h-screen items-center justify-center p-4">
			<Card className="border-border w-full max-w-md">
				<form onSubmit={handleSubmit} id="registration-form" className="space-y-0">
					<CardHeader className="text-center">
						<Button
							asChild
							variant="outline"
							className="text-primary hover:bg-primary hover:text-secondary mb-2 h-auto border-none bg-transparent p-2 text-3xl font-bold tracking-tight shadow-sm"
						>
							<Link to={ROUTES.home()}>ObjectBoard</Link>
						</Button>
						<CardTitle className="text-2xl">{t("sign_up")}</CardTitle>
						<CardDescription>{t("sign_up_label")}</CardDescription>
					</CardHeader>
					<CardContent>
						{errorMessage && (
							<div className="bg-destructive/20 text-destructive border-destructive mb-4 rounded-md border p-3">
								{errorMessage}
							</div>
						)}
						{isRegistrationSuccess && (
							<div className="mb-4 rounded-md border border-green-500 bg-green-500/20 p-3 text-green-700 dark:text-green-400">
								{t("sign_up_success")}
							</div>
						)}
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="name" className="text-foreground">
									{t("name")}
								</Label>
								<Input
									id="name"
									type="text"
									placeholder={t("name_placeholder")}
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									className="bg-input text-foreground border-border placeholder:text-muted-foreground focus:ring-ring"
								/>
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="email" className="text-foreground">
									{t("email")}
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="name@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="bg-input text-foreground border-border placeholder:text-muted-foreground focus:ring-ring"
								/>
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="password" className="text-foreground">
									{t("password")}
								</Label>
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									minLength={6}
									className="bg-input text-foreground border-border placeholder:text-muted-foreground focus:ring-ring"
								/>
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="password_confirmation" className="text-foreground">
									{t("confirm_password")}
								</Label>
								<Input
									id="password_confirmation"
									type="password"
									placeholder="••••••••"
									value={passwordConfirmation}
									onChange={(e) => setPasswordConfirmation(e.target.value)}
									required
									className="bg-input text-foreground border-border placeholder:text-muted-foreground focus:ring-ring"
								/>
							</div>
						</div>
					</CardContent>
					<CardFooter className="mt-4 flex flex-col items-center space-y-4">
						<Button
							type="submit"
							className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring w-full"
							disabled={isRegistrationSuccess}
						>
							{t("sign_up")}
						</Button>
						<p className="text-muted-foreground text-sm">
							{t("already_have_account")}{" "}
							<Link to={ROUTES.signIn()} className="text-primary font-medium hover:underline">
								{t("login")}
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

export default Registration;
