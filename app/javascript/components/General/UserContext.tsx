import React, { createContext, useContext } from "react";
import { User } from "@/Types/User";
import { getBaseURL } from "@/scripts/requestUtils";
import UseCustomQuery from "@/hooks/UseCustomQuery";

interface UserContextType {
	currentUser: User | null;
	isError: boolean;
	error: unknown;
	refetchUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};

interface Props {
	children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
	const {
		data: user,
		isError,
		error,
		refetch,
	} = UseCustomQuery({
		queryKey: ["user"],
		path: `${getBaseURL()}/users`,
	});

	return (
		<UserContext.Provider
			value={{
				currentUser: user,
				isError,
				error,
				refetchUser: refetch,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
