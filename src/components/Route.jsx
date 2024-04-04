import React from "react";
import ReactDOM from "react-dom/client";
import { Link } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import GamePage from "./GamePage";
import SoloGamePage from "./SoloGamePage";

export default function (props) {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/game/:roomName",
      element: <GamePage />,
    },
    {
        path: "/game",
        element: <GamePage />,
    },
    {
        path: "/solo",
        element: <SoloGamePage />,
    },
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
