import InputView from "./InputView";

export default class SelectInputView extends InputView {
    constructor(labelText, id) {
        super();
        this.create(labelText, id);
    }

    create(labelText, id) {
        let label = document.createElement("label");
        label.innerText = labelText;
        label.setAttribute("for", id);

        this.select = document.createElement("select");
        this.select.classList.add("form-control");
        this.select.id = id;
        this.select.name = id;
        this.select.required = true;

        this.select.append(this.createDefaultOption(labelText));

        this.append(label, this.select);
    }

    createDefaultOption(labelText) {
        let option = new Option(`-- select your ${labelText} --`, "");
        option.disabled = true;
        option.selected = true;
        return option;
    }
}

customElements.define("select-input-view", SelectInputView);
