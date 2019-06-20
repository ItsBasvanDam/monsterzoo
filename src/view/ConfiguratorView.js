import ViewBase from "./ViewBase";

export default class ConfiguratorView extends ViewBase {
    constructor() {
        super();
        document.querySelector("#configurator").append(this);
    }

    addButton(text, visualClass, clickCallback = undefined, isSubmit = false) {
        let button = document.createElement("button");
        button.innerText = text;
        button.classList.add("btn", "btn-block", "mt-3");
        button.classList.add(visualClass);
        if (!isSubmit) {
            button.type = "button";
        }
        if (clickCallback) {
            button.addEventListener("click", clickCallback);
        }
        this.addToVariableSection(button);
    }

    addToForm(element) {
        if (!this.form) {
            this.addForm();
        }
        this.form.append(element);
    }

    addToFixedSection(element) {
        if (!this.fixedSection) {
            this.addFixedSection();
        }
        this.fixedSection.append(element);
    }

    addToVariableSection(element) {
        if (!this.variableSection) {
            this.addVariableSection();
        }
        this.variableSection.append(element);
    }

    addForm() {
        this.form = document.createElement("form");
        this.append(this.form);
    }

    addFixedSection() {
        this.fixedSection = document.createElement("div");
        this.addToForm(this.fixedSection);
    }

    addVariableSection() {
        this.variableSection = document.createElement("div");
        this.addToForm(this.variableSection);
    }

    clearVariableSection() {
        if (!this.variableSection) {
            this.addVariableSection();
        }
        this.variableSection.innerHTML = "";
    }

    addFormListener(submitCallback) {
        if (!this.form) {
            this.addForm();
        }
        this.form.addEventListener("submit", submitCallback);
    }
}

customElements.define("configurator-view", ConfiguratorView);
