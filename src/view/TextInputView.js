import InputView from "./InputView";

export default class TextInputView extends InputView {
    constructor(labelText, id, inputCallback) {
        super();
        this.create(labelText, id, inputCallback);
    }

    create(labelText, id, inputCallback) {
        let label = document.createElement("label");
        label.innerText = labelText;
        label.setAttribute("for", id);

        this.input = document.createElement("input");
        this.input.type = "text";
        this.input.classList.add("form-control");
        this.input.id = id;
        this.input.name = id;
        this.input.required = true;
        this.input.addEventListener("input", inputCallback);

        this.append(label, this.input);
    }

    change(data) {
        this.input.value = data;
    }
}

customElements.define("text-input-view", TextInputView);
