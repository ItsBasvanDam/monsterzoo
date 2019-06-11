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

        this.select = document.createElement("select");
        this.select.classList.add("form-control");
        this.select.id = id;
        this.select.name = id;
        this.select.required = true;
        this.select.addEventListener("change", selectCallback);

        this.append(label, this.select);
    }

    setOptions(options) {
        options.forEach((option) => {
            this.select.append(new Option(option.value, option.key));
        });
    }

    change(data) {
        switch (data.key) {
            case "options":
                this.setOptions(data.value);
                break;
            case "value":
                console.log(data.value.key);
                this.select.value = data.value.key;
                break;
        }
    }
}

customElements.define("select-input-view", SelectInputView);
