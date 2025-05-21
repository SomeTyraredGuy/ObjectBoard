import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/shadcn/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/components/ui/card";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import { Switch } from "@/shadcn/components/ui/switch";
import UseCustomMutation from "@/hooks/UseCustomMutation";
import { useTranslation } from "react-i18next";
import ROUTES from "@/routes";

function LogIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { t } = useTranslation("translation", { keyPrefix: "users" });

	const handleLoginSuccess = () => {
		queryClient.invalidateQueries({ queryKey: ["user"] });
		navigate(ROUTES.home());
	};

	const {
		mutate: logInUser,
		error: loginError,
		isError: isLoginError,
		isSuccess: isLoginSuccess,
	} = UseCustomMutation({
		path: ROUTES.signIn(),
		method: "POST",
		onSuccess: handleLoginSuccess,
	});

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		logInUser({ user: { email, password, remember_me: rememberMe } });
	};

	return (
		<div className="bg-background flex min-h-screen items-center justify-center p-4">
			<Card className="border-standard bg-card text-card-foreground w-full max-w-sm">
				<form onSubmit={handleSubmit} className="space-y-0">
					<CardHeader>
						<div className="mb-2 text-center">
							<Button
								asChild
								variant="outline"
								className="text-primary hover:bg-primary hover:text-secondary mb-2 h-auto border-none bg-transparent p-2 text-3xl font-bold tracking-tight shadow-sm"
							>
								<Link to={ROUTES.home()}>ObjectBoard</Link>
							</Button>
						</div>
						<CardTitle className="text-foreground text-2xl">{t("login")}</CardTitle>
						<CardDescription className="text-muted-foreground">{t("login_label")}</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="user_email" className="text-foreground">
								{t("email")}
							</Label>
							<Input
								id="user_email"
								type="email"
								placeholder="name@example.com"
								required
								className="bg-input text-foreground border-border placeholder:text-muted-foreground focus:ring-ring"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="user_password" className="text-foreground">
								{t("password")}
							</Label>
							<Input
								id="user_password"
								type="password"
								placeholder="••••••••"
								required
								className="bg-input text-foreground border-border placeholder:text-muted-foreground focus:ring-ring"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Label htmlFor="user_remember_me" className="text-sm font-medium">
								{t("remember_me")}
							</Label>
							<Switch
								id="user_remember_me"
								checked={rememberMe}
								onCheckedChange={setRememberMe}
								className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
							/>
						</div>
						{isLoginError && loginError && (
							<p className="text-destructive text-sm font-medium">
								{(loginError as Error).message || t("login_failed")}
							</p>
						)}
						{isLoginSuccess && <p className="text-sm font-medium text-green-600">{t("login_success")}</p>}
					</CardContent>
					<CardFooter className="mt-4 flex flex-col items-center">
						<Button
							type="submit"
							className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring w-full"
						>
							{t("login")}
						</Button>
						<p className="text-muted-foreground mt-4 text-sm">
							{t("dont_have_account")}{" "}
							<Link to={ROUTES.signUp()} className="text-primary font-medium hover:underline">
								{t("sign_up")}
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

export default LogIn;
