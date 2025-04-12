import { getCSRFToken, getBaseURL } from "../../../scripts/requestUtils.js";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
	path: string;
	refetchFn: () => void;
	defaultValue: unknown;
	method: string;
};

export default function UseMemberMutation({ path, refetchFn, defaultValue, method }: Props) {
	const [value, setValue] = useState(defaultValue);

	const { mutate, error, isError, isSuccess } = useMutation({
		mutationFn: async () => {
			const response = await fetch(`${getBaseURL()}/member/${path}`, {
				method: method,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					"X-CSRF-Token": getCSRFToken(),
				},
				body: JSON.stringify({ value }),
			});

			if (!response.ok) {
				const errorData = await response.json();

				if (errorData.error) throw new Error(errorData.error);
				throw new Error();
			}
		},
		onSuccess: refetchFn,
	});

	return {
		mutate,
		error,
		isError,
		isSuccess,
		value,
		setValue,
	};
}
