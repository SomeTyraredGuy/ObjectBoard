import { useQuery } from "@tanstack/react-query";

type Props = {
	queryKey: string[];
	path: string;
	refetchInterval?: number | false;
};

export default function UseCustomQuery({ queryKey, path }: Props) {
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

	return { data, isError, error, refetch, isLoading };
}
