import InputModel from "./InputModel";
import eventDispatcher from "../util/EventDispatcher";

export default class SelectInputModel extends InputModel {
    constructor(name, id) {
        super();
        this.name = name;
        this.id = id;
        this.options = new Array();
    }

    setOptions(options) {
        this.options = options;
        eventDispatcher.dispatch(this.id, {
            key: "options",
            value: this.options
        });

        try {
            this.setValue(this.value);
        } catch (error) {
            this.setValue(options[0]);
        }
    }

    getOptions() {
        return this.options;
    }

    setValue(value) {
        if (this.options.includes(value)) {
            this.value = value;
            eventDispatcher.dispatch(this.id, {
                key: "value",
                value: this.value
            });
        } else {
            throw new Error(
                `Error: select input "${this.getValue()}" does not have the option ${value}`
            );
        }
    }
}
