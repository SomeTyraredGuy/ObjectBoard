import React from "react";
import QueryWrap from "./Board/QueryWrap";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./Home/Home";
import Board from "./Board/Board";
import Boards from "./Boards/Boards";
import "@/scripts/I18n.js";
import NotFoundPage from "./NotFoundPage";
import { UserProvider } from "./General/UserContext";
import LogIn from "./LogIn/LogIn";

function App() {
	const router = createBrowserRouter([
		{ path: "/:locale?", element: <Home /> },
		{ path: "/:locale?/boards/:id", element: <Board /> },
		{ path: "/:locale?/boards", element: <Boards /> },
		{ path: "/:locale?/users/sign_in", element: <LogIn /> },
		// TODO: devise
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
