import { getCSRFToken, setCSRFToken } from "../scripts/requestUtils.js";
import { useMutation } from "@tanstack/react-query";
import useNotification from "./useNotification.js";

type Props = {
	path: string;
	onSuccess?: () => void;
	onResponse?: (response: Response) => void;
	method: string;
	disableNotification?: boolean;
	notifySuccess?: boolean;
	successMessage?: string;
};

export default function UseCustomMutation({
	path,
	onSuccess,
	method,
	onResponse = () => {},
	notifySuccess = true,
	successMessage,
	disableNotification = false,
}: Props) {
	const { mutate, error, isError, isSuccess, isPending } = useMutation({
		mutationFn: async (value: unknown) => {
			const response = await fetch(path, {
				method: method,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					"X-CSRF-Token": getCSRFToken(),
				},
				body: JSON.stringify(value),
			});

			onResponse(response);

			if (!response.ok) {
				const errorData = await response.json();

				if (errorData.error) throw new Error(errorData.error);
				throw new Error();
			}

			const csrfToken = response.headers.get("X-CSRF-Token");
			if (csrfToken) setCSRFToken(csrfToken);
		},
		onSuccess: onSuccess,
	});

	if (!disableNotification) {
		const notification = notifySuccess ? { isError, error, isSuccess, successMessage } : { isError, error };

		useNotification(notification);
	}

	return {
		mutate,
		error,
		isError,
		isSuccess,
		isPending,
	};
}
