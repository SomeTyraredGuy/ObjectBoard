import React, { createContext, useContext } from "react";
import { User } from "@/Types/User";
import UseCustomQuery from "@/hooks/UseCustomQuery";
import ROUTES from "@/routes";

interface UserContextType {
	currentUser: User | null;
	isError: boolean;
	isLoading: boolean;
	error;
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
		isLoading,
		refetch,
	} = UseCustomQuery({
		queryKey: ["user"],
		path: ROUTES.UserApi(),
	});

	return (
		<UserContext.Provider
			value={{
				currentUser: user,
				isError,
				error,
				isLoading,
				refetchUser: refetch,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
