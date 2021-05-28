import { render } from "preact";
import { html } from "htm/preact";

import { App } from "./App";

const app = document.getElementById("app");

if (app) {
  render(html`<${App} />`, app);
}
