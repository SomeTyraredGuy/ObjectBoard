import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { Button } from "@/shadcn/components/ui/button";
import UseMemberMutation from "@/hooks/Board/Members/UseMemberMutation";
import { Input } from "@/shadcn/components/ui/input";
import useNotification from "@/hooks/useNotification";

type Props = {
	refetchFn: () => void;
	closeFn: () => void;
	open: boolean;
};

function AddMemberForm({ refetchFn, closeFn, open }: Props) {
	const [name, setName] = useState("");
	const {
		mutate: add,
		error,
		isError,
		isSuccess,
	} = UseMemberMutation({
		path: "add_to_board",
		refetchFn: refetchFn,
		method: "POST",
	});

	useNotification({
		isError,
		error,
		isSuccess,
		successMessage: `${name} has been added!`,
	});

	return (
		<Dialog open={open}>
			<DialogContent
				closeFn={() => {
					closeFn();
					setName("");
				}}
			>
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">Add new member</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<Input
					type="text"
					placeholder="New member nickname"
					onChange={(event) => setName(event.target.value)}
					className="justify-self-center-safe w-2/3"
				/>
				<DialogFooter className="!justify-center">
					<Button className="w-26" onClick={() => add(name)} disabled={name === ""}>
						Add
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default AddMemberForm;
