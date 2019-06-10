export default class MonsterModel {
    constructor() {
        this.currentField = null;
        this.attributes = new Array();
    }

    setCurrentField(field) {
        this.currentField = field
    }

    setAttribute(attributeName, attributeValue) {
        this.attributes[attributeName] = attributeValue;
    }

    getAttribute(attributeName) {
        return this.attributes[attributeName];
    }
}
