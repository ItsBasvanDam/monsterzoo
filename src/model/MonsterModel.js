import eventDispatcher from "../util/EventDispatcher";

export default class MonsterModel {
    constructor() {
        this.currentField = null;
        this.attributes = new Array();
    }

    setCurrentField(field) {
        this.currentField = field;
        eventDispatcher.dispatch(`monster${this.getAttribute("id")}`, {
            x: this.getCurrentField().x,
            y: this.getCurrentField().y,
            regionName: this.getCurrentField().regionName,
            id: this.getAttribute("id")
        });
    }

    getCurrentField() {
        return this.currentField;
    }

    setAttribute(attributeName, attributeValue) {
        this.attributes[attributeName] = attributeValue;
    }

    getAttribute(attributeName) {
        return this.attributes[attributeName];
    }
}
