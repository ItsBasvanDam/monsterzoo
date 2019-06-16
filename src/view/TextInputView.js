import InputView from "./InputView";

export default class TextInputView extends InputView {
    constructor(labelText, id, inputCallback, isDisabled = false) {
        super();
        this.create(labelText, id, inputCallback, isDisabled);
    }

    create(labelText, id, inputCallback, isDisabled) {
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
        if (isDisabled) {
            this.input.disabled = true;
        }

        this.append(label, this.input);
    }

    change(data) {
        this.input.value = data;
    }
}

customElements.define("text-input-view", TextInputView);
