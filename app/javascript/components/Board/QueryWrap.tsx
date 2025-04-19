import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index, { IndexProps } from "./Index";

function QueryWrap({ db }: IndexProps) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchInterval: 60000,
			},
		},
	});

	return (
		<QueryClientProvider client={queryClient}>
			<Index db={db} />
		</QueryClientProvider>
	);
}

export default QueryWrap;
