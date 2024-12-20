import { Controller } from "@hotwired/stimulus"
import React from "react"
import { createRoot } from "react-dom/client";
import Board from "../components/Board"

// Connects to data-controller="boards-react"
export default class extends Controller {
  connect() {
    const board = document.getElementById("board");
    createRoot(board).render(<Board />);
  }
}
