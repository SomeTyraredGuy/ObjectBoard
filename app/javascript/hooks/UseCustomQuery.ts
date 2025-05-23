import { useQuery } from "@tanstack/react-query";
import useNotification from "./useNotification";

type Props = {
	queryKey: string[];
	path: string;
	refetchInterval?: number | false;
	disableNotification?: boolean;
};

export default function UseCustomQuery({ queryKey, path, disableNotification = false }: Props) {
	const { data, isError, error, refetch, isLoading } = useQuery({
		queryKey: queryKey,
		queryFn: async () => {
			const JSON = await fetch(path);
			const response = await JSON.json();

			if (!JSON.ok) {
				if (response.error) throw new Error(response.error);
				throw new Error();
			}

			return response;
		},
	});

	if (!disableNotification) {
		useNotification({
			isError,
			error,
		});
	}

	return { data, isError, error, refetch, isLoading };
}
