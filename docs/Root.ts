import { html, Component } from "htm/preact";
import { Preview } from "./Preview";
import { Form, FormState } from "./Form";
import { Code } from "./Code";

export type RootState = {
  text?: string;
  width: number;
  height: number;
  color: string;
  backgroundColor: string;
};

export class Root extends Component<RootState> {
  state = {
    text: null,
    width: 600,
    height: 400,
    color: "#000000",
    backgroundColor: "#cccccc"
  };

  get data() {
    return { ...this.state };
  }

  submit = (data: FormState) => {
    this.setState(data);
  };

  render() {
    return html`
      <${Preview} data="${this.data}" />
      <${Form} data="${this.data}" submit="${this.submit}" />
      <${Code} code="${this.data}" />
    `;
  }
}
