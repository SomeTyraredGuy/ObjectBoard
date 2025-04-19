import { getCSRFToken, getBaseURL } from "../../../scripts/requestUtils.js";
import { useMutation } from "@tanstack/react-query";

type Props = {
	path: string;
	refetchFn: () => void;
	method: string;
};

export default function UseMemberMutation({ path, refetchFn, method }: Props) {
	const { mutate, error, isError, isSuccess } = useMutation({
		mutationFn: async (value: unknown) => {
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
	};
}
