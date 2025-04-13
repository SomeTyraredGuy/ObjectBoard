import { useQuery } from "@tanstack/react-query";
import { getBaseURL } from "../../../scripts/requestUtils";

export default function UseCurrentMemberQuery() {
	const {
		data: currentMember,
		refetch,
		isLoading,
		error,
		isError,
	} = useQuery({
		queryKey: ["current_member"],
		queryFn: async () => {
			const JSON = await fetch(`${getBaseURL()}/member/current`);
			const response = await JSON.json();

			if (!JSON.ok) {
				if (response.error) throw new Error(response.error);
				throw new Error();
			}

			return response;
		},
	});

	return { currentMember, refetch, isLoading, error, isError };
}
