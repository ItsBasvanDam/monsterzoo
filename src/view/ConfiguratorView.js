export default class ConfiguratorView extends HTMLElement {
    constructor() {
        super();
        document.querySelector("#configurator").append(this);
    }

    addTitle(text) {
        let title = document.createElement("h3");
        title.innerText = text;
        this.append(title);
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
}

customElements.define("configurator-view", ConfiguratorView);
