export default class ConfiguratorModel {
    constructor() {
        this.inputs = new Array();
        this.configuratorField = null;
    }

    async getData() {
        await this.getJSON("data/monsterData.json").then(json => {
            this.data = json;
        });
        await this.getJSON("data/monsterRules.json").then(json => {
            this.validationRules = json;
        });
    }

    async getJSON(url) {
        return fetch(url).then(response => response.json());
    }

    setConfiguratorField(field) {
        this.configuratorField = field;
    }

    getConfiguratorField() {
        return this.configuratorField;
    }

    getMonsterTypes() {
        let types = new Array();
        let rawTypeData = Object.keys(this.data);
        for (let index in rawTypeData) {
            types.push({
                key: rawTypeData[index],
                value: this.capitalizeFirstLetter(rawTypeData[index])
            });
        }
        return types;
    }

    getAttributes(monsterType) {
        return this.data[monsterType];
    }

    validateAll() {
        this.inputs.forEach((input) => {
            this.applyValidation(input.id);
        });
    }

    applyValidation(inputId) {
        let rules = this.validationRules[this.getInputValue("monster-type")];
        rules.forEach(rule => {
            let affectedInput = this.getInput(rule.compareName);
            if (rule.triggerName == inputId && affectedInput) {
                // Run rule.
                if (
                    eval(
                        `"${this.getInputValue(rule.triggerName)}" ${rule.operator} "${rule.value}"`
                    )
                ) {
                    // Set values of "compareName" to "then" array.
                    affectedInput.setOptions(rule.then);
                } else {
                    // Set values of "compareName" to "else" array.
                    affectedInput.setOptions(rule.else);
                }
            }
        });
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    addInput(input) {
        this.inputs.push(input);
    }

    getInput(inputId) {
        for (let index in this.inputs) {
            if (this.inputs[index].id == inputId) {
                return this.inputs[index];
            }
        }
    }

    setInputValue(inputId, value) {
        let input = this.getInput(inputId);
        if (input) {
            input.setValue(value);
        }
    }

    getInputValue(inputId) {
        let input = this.getInput(inputId);
        if (input) {
            return input.value;
        } else {
            throw new Error(`input of type "${inputId}" does not exist`);
        }
    }

    clearModel(inputId) {
        for (let index in this.inputs) {
            if (this.inputs[index].id == inputId) {
                this.inputs.splice(index, 1);
            }
        }
    }
}
