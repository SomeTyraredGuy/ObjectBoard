import { Controller } from "@hotwired/stimulus"
import React from "react"
import { createRoot } from "react-dom/client";
import Index from "../components/Board/Index"
import QueryWrap from "../components/Board/QueryWrap"

// Connects to data-controller="boards-react"
export default class extends Controller {
  connect() {
    const root = document.getElementById("root");
    const timestamp = Date.now();
    createRoot(root).render(<QueryWrap key={timestamp} db={JSON.parse(root.dataset.db)} />);
  }
}










































































































