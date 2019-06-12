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
            this.setValue(this.value.key);
        } catch (error) {
            this.setValue(options[0].key);
        }
    }

    getOptions() {
        return this.options;
    }

    setValue(value) {
        if (this.value != value) {
            if (this.optionListHasKey(this.options, value)) {
                this.value = value;
                eventDispatcher.dispatch(this.id, {
                    key: "value",
                    value: this.value
                });
            } else {
                throw new Error(
                    `select input "${this.name}" does not have the option ${value}`
                );
            }
        }
    }

    optionListHasKey(options, key) {
        for (let index in options) {
            if (options[index].key == key) {
                return true;
            }
        }
        return false;
    }
}
