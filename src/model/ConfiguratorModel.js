export default class ConfiguratorModel {
    constructor() {
        this.inputs = new Array();
        this.configuratorField = null;
    }

    async getData() {
        await this.getMonsterDataFromAPI().then((json) => {
            this.data = json;
        });
    }

    setConfiguratorField(field) {
        this.configuratorField = field;
    }

    async getMonsterDataFromAPI() {
        return fetch("data/monsterData.json")
            .then((response) => response.json());
    }

    getConfiguratorField() {
        return this.configuratorField;
    }

    getMonsterTypes() {
        return Object.keys(this.data);
    }

    getAttributes(monsterType) {
        return this.data[monsterType];
    }
}
