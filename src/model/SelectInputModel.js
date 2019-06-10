import InputModel from "./InputModel";

export default class SelectInputModel extends InputModel {
    constructor() {
        super();

        this.options = new Array();
    }

    setOptions(options) {
        this.options = options;

        try {
            this.setValue(this.value);
        } catch(error) {
            this.setValue(options[0]);
        }
    }

    getOptions() {
        return this.options;
    }

    setValue(value) {
        if (this.options.includes(value)) {
            this.value = value;
        } else {
            throw new Error(`Error: select input "${this.getValue()}" does not have the option ${value}`);
        }
    }
}
