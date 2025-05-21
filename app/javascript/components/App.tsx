import React from "react";
import QueryWrap from "./Board/QueryWrap";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./Home/Home";
import Board from "./Board/Board";
import Boards from "./Boards/Boards";
import "@/scripts/I18n.js";
import NotFoundPage from "./NotFoundPage";
import { UserProvider } from "./General/UserContext";
import LogIn from "./Users/LogIn";
import Registration from "./Users/Registration";
import UserProfile from "./Users/UserProfile";
import { getRoutes } from "@/routes";

function App() {
	const ROUTES = getRoutes(true);
	const router = createBrowserRouter([
		{ path: ROUTES.home(), element: <Home /> },
		{ path: ROUTES.board(), element: <Board /> },
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
			</UserProvider>
		</QueryWrap>
	);
}

export default App;
