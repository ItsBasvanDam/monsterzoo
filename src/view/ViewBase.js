export default class ViewBase extends HTMLElement {
    constructor() {
        super();
    }

    addTitle(text) {
        let title = document.createElement("h3");
        title.innerText = text;
        this.append(title);
    }
}
