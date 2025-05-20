import { getCSRFToken, setCSRFToken } from "../scripts/requestUtils.js";
import { useMutation } from "@tanstack/react-query";

type Props = {
	path: string;
	onSuccess?: () => void;
	onResponse?: (response: Response) => void;
	method: string;
};

export default function UseCustomMutation({ path, onSuccess, method, onResponse = () => {} }: Props) {
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

	return {
		mutate,
		error,
		isError,
		isSuccess,
		isPending,
	};
}
