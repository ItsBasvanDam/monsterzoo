export default class InputModel {
    constructor() {
        this.name = null;
        this.value = null;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setValue(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }
}
