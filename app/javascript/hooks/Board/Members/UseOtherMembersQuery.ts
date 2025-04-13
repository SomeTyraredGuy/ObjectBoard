import { useQuery } from "@tanstack/react-query";
import { getBaseURL } from "../../../scripts/requestUtils";

export default function UseOtherMembersQuery() {
	const {
		data: otherMembers = [],
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["other_members"],
		queryFn: async () => {
			const JSON = await fetch(`${getBaseURL()}/member/others`);
			const response = await JSON.json();

			if (!JSON.ok) {
				if (response.error) throw new Error(response.error);
				throw new Error();
			}

			return response;
		},
	});

	return { otherMembers, isError, error, refetch };
}
