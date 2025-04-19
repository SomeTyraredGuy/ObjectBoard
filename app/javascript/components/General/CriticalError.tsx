import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shadcn/components/ui/dialog";
import { Separator } from "@/shadcn/components/ui/separator";
import React from "react";

type Props = {
	title: string;
	message: string;
};

function CriticalError({ title, message }: Props) {
	setTimeout(() => {
		window.location.reload();
	}, 10000);

	return (
		<Dialog open={true}>
			<DialogContent showXButton={false}>
				<DialogTitle className="text-destructive text-center text-2xl font-bold">
					Critical Error: {title}
				</DialogTitle>
				<DialogDescription className="mt-2 text-center text-sm">
					<p className="mb-4 text-lg font-medium">Description: {message}</p>
					<Separator />
					<p className="text-muted-foreground text-sm">
						The page will be reloaded in a 10 seconds. If it doesn&apos;t, please refresh the page manually.
					</p>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}

export default CriticalError;
