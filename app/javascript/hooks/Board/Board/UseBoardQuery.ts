import { useQuery } from "@tanstack/react-query";
import { getBaseURL } from "../../../scripts/requestUtils";

export default function UseBoardQuery() {
	const {
		data: board,
		refetch,
		isLoading,
		error,
		isError,
	} = useQuery({
		queryKey: ["board"],
		queryFn: async () => {
			const JSON = await fetch(getBaseURL() + "/get");
			const response = await JSON.json();

			if (!JSON.ok) {
				if (response.error) throw new Error(response.error);
				throw new Error();
			}

			return response;
		},
	});

	return { board, refetch, isLoading, error, isError };
}
