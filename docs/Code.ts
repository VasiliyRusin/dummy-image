import { html, Component } from "htm/preact";

export type CodeProps = {
  code: string;
};

export class Code extends Component<CodeProps> {
  render({ code }: CodeProps) {
    return html` <code>
      ${Object.entries(code)
        .filter(([key, value]: any) => key && value)
        .map(([key, value]: any) => html`${key}: ${value}<br />`)}
    </code>`;
  }
}
