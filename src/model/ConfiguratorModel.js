export default class ConfiguratorModel {
    constructor() {
        this.inputs = new Array();
        this.configuratorField = null;
    }

    async getData() {
        await this.getMonsterDataFromAPI().then(json => {
            this.data = json;
        });
    }

    setConfiguratorField(field) {
        this.configuratorField = field;
    }

    async getMonsterDataFromAPI() {
        return fetch("data/monsterData.json").then(response => response.json());
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

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    addInput(input) {
        this.inputs.push(input);
    }

    setInputValue(inputId, value) {
        for (let index in this.inputs) {
            if (this.inputs[index].id == inputId) {
                this.inputs[index].setValue(value);
            }
        }
    }
}
