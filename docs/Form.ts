import { createRef } from "preact";
import { html, Component } from "htm/preact";

import { RootState } from "./Root";

export type FormProps = {
  data: RootState;
  submit: (data: FormState) => {};
};

export type FormState = Partial<RootState>;

export class Form extends Component<FormProps> {
  state: FormState = {};
  form = createRef<HTMLFormElement>();

  componentDidMount() {
    this.setState(JSON.parse(JSON.stringify(this.props.data)));
  }

  onSubmit = (e: Event) => {
    const from = this.form.current;

    e.preventDefault();

    if (from?.reportValidity()) {
      this.props.submit(this.state);
    }
  };

  onInput = (e: any, name: string) => {
    let { value } = e.target;
    const from = this.form.current;

    if (value === "") {
      value = null;
    }

    this.setState({ [name]: value }, () => {
      // Check if requestSubmit() is available to current browser
      if (from?.requestSubmit) {
        from?.requestSubmit();
      }
      //If not, perform constraint validation and call submit function directly
      else {
        if (from?.reportValidity()) {
          from?.dispatchEvent(new Event("submit", { cancelable: true }));
        }
      }
    });
  };

  render(_: any, { text, width, height, color, backgroundColor }: FormState) {
    return html` <form onSubmit="${this.onSubmit}" ref="${this.form}">
      <div>
        <input
          type="number"
          min="1"
          max="999"
          required
          value="${width}"
          onInput="${(e: any) => this.onInput(e, "width")}"
        />
        <span style="padding: 0 6px;">×</span>
        <input
          type="number"
          min="1"
          max="999"
          value="${height}"
          onInput="${(e: any) => this.onInput(e, "height")}"
        />
        <input
          requird
          type="color"
          value="${color}"
          onInput="${(e: any) => this.onInput(e, "color")}"
        />
        <input
          type="color"
          value="${backgroundColor}"
          onInput="${(e: any) => this.onInput(e, "backgroundColor")}"
        />
      </div>
      <div>
        <input
          type="text"
          value="${text}"
          onInput="${(e: any) => this.onInput(e, "text")}"
        />
      </div>
    </form>`;
  }
}
