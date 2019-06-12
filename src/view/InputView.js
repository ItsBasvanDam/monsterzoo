export default class InputView extends HTMLElement {
    constructor() {
        super();
    }

    fireEvent(eventName) {
        this.input.dispatchEvent(new Event(eventName));
    }
}
