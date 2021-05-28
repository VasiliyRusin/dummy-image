import { html, Component } from "htm/preact";
import { Root } from "./Root";

export class App extends Component {
  render() {
    return html` <${Root} />`;
  }
}
