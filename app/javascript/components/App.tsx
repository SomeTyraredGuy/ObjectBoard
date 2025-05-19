import React from "react";
import QueryWrap from "./Board/QueryWrap";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./Home/Home";
import Board from "./Board/Board";
import Boards from "./Boards/Boards";
import "@/scripts/I18n.js";
import NotFoundPage from "./NotFoundPage";

function App() {
	const router = createBrowserRouter([
		{ path: "/:locale?", element: <Home /> },
		{ path: "/:locale?/boards/:id", element: <Board /> },
		{ path: "/:locale?/boards", element: <Boards /> },
		// TODO: devise
		{ path: "*", element: <NotFoundPage /> },
	]);
	return (
		<QueryWrap>
			<RouterProvider router={router} />
		</QueryWrap>
	);
}

export default App;
