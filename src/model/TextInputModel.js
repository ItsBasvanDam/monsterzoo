import InputModel from "./InputModel";
import eventDispatcher from "../util/EventDispatcher";

export default class TextInputModel extends InputModel {
    constructor(name, id) {
        super();
        this.name = name;
        this.id = id;
    }

    setValue(value) {
        this.value = value;
        eventDispatcher.dispatch(this.id, value);
    }

    setOptions(option) {
        this.setValue(option);
    }
}
