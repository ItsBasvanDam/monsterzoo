import InputView from "./InputView";

export default class TextInputView extends InputView {
    constructor(labelText, id) {
        super();
        this.create(labelText, id);
    }

    create(labelText, id) {
        let label = document.createElement("label");
        label.innerText = labelText;
        label.setAttribute("for", id);

        let input = document.createElement("input");
        input.type = "text";
        input.classList.add("form-control");
        input.id = id;
        input.name = id;
        input.required = true;

        this.append(label, input);
    }
}

customElements.define("text-input-view", TextInputView);
