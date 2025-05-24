import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = {
	children: React.ReactNode;
};

function QueryWrap({ children }: Props) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchInterval: 60000,
			},
		},
	});

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryWrap;
