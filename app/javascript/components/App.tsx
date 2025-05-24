import React from "react";
import QueryWrap from "./General/QueryWrap";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./Home/Home";
import Boards from "./Boards/Boards";
import "@/scripts/I18n.js";
import NotFoundPage from "./NotFoundPage";
import { UserProvider } from "./General/UserContext";
import LogIn from "./Users/LogIn";
import Registration from "./Users/Registration";
import UserProfile from "./Users/UserProfile";
import { getRoutes } from "@/routes";
import { Toaster } from "sonner";
import BoardWrapper from "./Board/BoardWrapper";

function App() {
	const ROUTES = getRoutes(true);
	const router = createBrowserRouter([
		{ path: ROUTES.home(), element: <Home /> },
		{ path: ROUTES.board(), element: <BoardWrapper /> },
		{ path: ROUTES.boards(), element: <Boards /> },
		{ path: ROUTES.signIn(), element: <LogIn /> },
		{ path: ROUTES.signUp(), element: <Registration /> },
		{ path: ROUTES.profile(), element: <UserProfile /> },
		{ path: "*", element: <NotFoundPage /> },
	]);
	return (
		<QueryWrap>
			<UserProvider>
				<RouterProvider router={router} />
				<Toaster expand position="top-center" richColors theme="light" />
			</UserProvider>
		</QueryWrap>
	);
}

export default App;
