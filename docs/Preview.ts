import { html, Component } from "htm/preact";
import { ImageManager, Image } from "../src";
import { RootState } from "./Root";
import { debonce } from "./utils";

type PreviewProps = {
  data: RootState;
};

type PreviewState = {
  key?: string;
  src?: string | Blob;
};

export class Preview extends Component<PreviewProps, PreviewState> {
  private debonecedUpdate: () => Promise<void>;
  private imageManager: ImageManager = new ImageManager();

  state: PreviewState = {};

  constructor() {
    super();

    this.debonecedUpdate = debonce(this.update, 300);
  }

  async componentDidMount() {
    this.updateImage();
  }

  shouldComponentUpdate(props: PreviewProps, state: PreviewState) {
    if (state?.key !== Image.getKey(props.data)) {
      this.debonecedUpdate();
    }

    return true;
  }

  update = () => {
    this.updateImage();
  };

  updateImage = async () => {
    const image = this.imageManager.createImage(this.props.data);
    const key = image.key;
    const src = await image.asBase64();

    this.setState({ key, src });
  };

  render(_: PreviewProps, { src }: PreviewState) {
    return html`<img src="${src}" />`;
  }
}
