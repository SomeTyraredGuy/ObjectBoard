import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
	isError?: boolean;
	error?: Error;
	isSuccess?: boolean;
	successMessage?: string;
};

export default function useNotification({ isError, isSuccess, error, successMessage }: Props) {
	useEffect(() => {
		if (isSuccess) {
			toast.success("Success!", {
				description: successMessage,
			});
		}
		if (isError) {
			const name = error?.name || "Error";
			toast.error(name, { description: error?.message });
		}
	}, [isSuccess, isError]);
}
