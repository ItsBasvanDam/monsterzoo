import InputView from "./InputView";

export default class SelectInputView extends InputView {
    constructor(labelText, id, selectCallback) {
        super();
        this.name = labelText;
        this.create(id, selectCallback);
    }

    create(id, selectCallback) {
        let label = document.createElement("label");
        label.innerText = this.name;
        label.setAttribute("for", id);

        this.input = document.createElement("select");
        this.input.classList.add("form-control");
        this.input.id = id;
        this.input.name = id;
        this.input.required = true;
        this.input.addEventListener("change", selectCallback);

        this.append(label, this.input);
    }

    setOptions(options) {
        this.input.innerHTML = "";
        options.forEach((option) => {
            this.input.append(new Option(option.value, option.key));
        });
    }

    change(data) {
        switch (data.key) {
            case "options":
                this.setOptions(data.value);
                break;
            case "value":
                this.input.value = data.value;
                break;
        }
    }
}

customElements.define("select-input-view", SelectInputView);
