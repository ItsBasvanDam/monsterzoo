import ConfiguratorModel from "../model/ConfiguratorModel";
import BoardController from "./BoardController";
import ConfiguratorView from "../view/ConfiguratorView";
import TextInputView from "../view/TextInputView";
import SelectInputView from "../view/SelectInputView";
import SelectInputModel from "../model/SelectInputModel";
import eventDispatcher from "../util/EventDispatcher";
import TextInputModel from "../model/TextInputModel";
import CanvasController from "./CanvasController";
import MonsterModel from "../model/MonsterModel";
import AWN from "../../node_modules/awesome-notifications/dist/index";
import WeatherController from "./WeatherController";

export default class MonsterController {
    constructor() {
        this.notifier = new AWN({
            icons: { enabled: false },
            position: "bottom-right"
        });
        this.initialize();
    }

    async initialize() {
        this.weatherController = new WeatherController();
        this.boardController = new BoardController(this);
        this.canvasController = new CanvasController();

        this.displayLoading();
        this.boardController
            .loadGameData()
            .then(() => {
                this.hideLoading();
                let configuratorField = this.boardController.getConfiguratorField();

                this.model = new ConfiguratorModel();
                this.model
                    .getData()
                    .then(() => {
                        this.model.setConfiguratorField(configuratorField);

                        this.drawConfigurator();
                        this.drawBoard();
                    })
                    .catch(error => {
                        this.onError(error);
                    });
            })
            .catch(error => {
                this.onError(error);
            });
    }

    displayLoading() {
        document.querySelector("#loading").classList.add("show");
    }

    hideLoading() {
        document.querySelector("#loading").classList.remove("show");
    }

    drawBoard() {
        this.boardController.drawBoard();
    }

    drawConfigurator() {
        this.onTextChange = this.onTextChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onMonsterDelete = this.onMonsterDelete.bind(this);

        this.view = new ConfiguratorView();
        this.view.addTitle("Monster Configurator");
        this.view.addFormListener(this.onFormSubmit);

        let editField = this.boardController.createConfiguratorField();
        this.view.addToFixedSection(editField.getElement());

        this.createTextInput("Name", "name", false, false);
        this.createSelectInput(
            "Monster Type",
            "monster-type",
            this.model.getMonsterTypes(),
            false
        );
    }

    getWeather(referenceCity) {
        return this.weatherController.getWeather(referenceCity);
    }

    setWeather(weather) {
        this.weatherController.setWeather(weather);
    }

    createTextInput(
        name,
        id,
        isDisabled = false,
        isVariable = true,
        value = ""
    ) {
        let newTextInputModel = new TextInputModel(name, id);
        let newTextInputView = new TextInputView(
            newTextInputModel.name,
            newTextInputModel.id,
            this.onTextChange,
            isDisabled
        );
        // Link the View and Model using an EventDispatcher in Singleton-scope.
        newTextInputView.change = newTextInputView.change.bind(
            newTextInputView
        );
        eventDispatcher.clearListeners(newTextInputModel.id);
        eventDispatcher.addListener(
            newTextInputModel.id,
            newTextInputView.change
        );

        this.model.addInput(newTextInputModel);
        if (isVariable) {
            this.view.addToVariableSection(newTextInputView);
        } else {
            this.view.addToFixedSection(newTextInputView);
        }
        newTextInputModel.setValue(value);
        newTextInputView.fireEvent("input");
    }

    createSelectInput(name, id, options, isVariable = true) {
        let newSelectInputModel = new SelectInputModel(name, id);
        let newSelectInputView = new SelectInputView(
            newSelectInputModel.name,
            newSelectInputModel.id,
            this.onSelectChange
        );
        // Link the View and Model using an EventDispatcher in Singleton-scope.
        newSelectInputView.change = newSelectInputView.change.bind(
            newSelectInputView
        );
        eventDispatcher.clearListeners(newSelectInputModel.id);
        eventDispatcher.addListener(
            newSelectInputModel.id,
            newSelectInputView.change
        );

        this.model.addInput(newSelectInputModel);
        if (isVariable) {
            this.view.addToVariableSection(newSelectInputView);
        } else {
            this.view.addToFixedSection(newSelectInputView);
        }

        newSelectInputModel.setOptions(options);
        newSelectInputView.fireEvent("change");
    }

    /**
     * Used to set the form data equal to that of the monsters
     * attributes.
     *
     * @param monsterModel
     */
    setFormMonster(monsterModel) {
        let tempMonster = new MonsterModel();
        Object.assign(tempMonster, monsterModel);
        for (let key in tempMonster.attributes) {
            this.model.setInputValue(key, tempMonster.attributes[key]);
            this.setMonsterType(key);
            switch (key) {
                case "color":
                    this.canvasController.setColor(tempMonster.attributes[key]);
                    break;
                case "imageData":
                    this.canvasController.setDrawing(
                        tempMonster.attributes[key]
                    );
                    break;
            }
            this.model.applyValidation(key);
        }
    }

    prepareForm() {
        this.canvasController.initializeCanvas();
        let attributes = this.model.getAttributes(
            this.model.getInputValue("monster-type")
        );
        this.view.clearVariableSection();

        attributes.forEach(attribute => {
            this.model.clearModel(attribute.name);
            switch (attribute.type) {
                case "select":
                    this.createSelectInput(
                        attribute.displayName,
                        attribute.name,
                        attribute.values
                    );
                    break;
                case "fact":
                    this.createTextInput(
                        attribute.displayName,
                        attribute.name,
                        true,
                        true,
                        attribute.value
                    );
                    break;
            }
        });
        // Validate all attributes to set them and ensure validity.
        this.model.validateAll();
        this.view.addToVariableSection(this.canvasController.getElement());
        this.view.addButton("Save Monster", "btn-success", undefined, true);
        this.view.addButton(
            "Delete Monster",
            "btn-danger",
            this.onMonsterDelete
        );
    }

    onTextChange(event) {
        this.model.setInputValue(event.target.id, event.target.value);
    }

    onSelectChange(event) {
        this.model.setInputValue(event.target.id, event.target.value);
        this.setMonsterType(event.target.id);
        this.model.applyValidation(event.target.id);
    }

    setMonsterType(type) {
        if (type == "monster-type") {
            this.prepareForm();
        }
    }

    onFormSubmit(event) {
        event.preventDefault();
        if (this.canvasController.hasDrawing()) {
            let newMonster = this.model.saveMonster(
                this.boardController.getConfiguratorMonster()
            );
            if (!newMonster.getAttribute("id")) {
                // This is a new monster.
                let monsterIndex = this.boardController.addMonster(newMonster);
                newMonster.setAttribute("id", monsterIndex);
            }
            // Set attributes like the monsters image, imageData and color.
            this.canvasController.setColor(newMonster.getAttribute("color"));
            newMonster.setAttribute(
                "image",
                this.canvasController.getDataURL()
            );
            newMonster.setAttribute(
                "imageData",
                this.canvasController.getDrawingData()
            );
            this.boardController.displayMonster(
                newMonster,
                this.boardController.getConfiguratorField()
            );
            newMonster.setCurrentField(
                this.boardController.getConfiguratorField()
            );
            this.notifier.success("Monster successfully saved!");
        } else {
            this.notifier.alert("Please draw a monster before saving!");
        }
    }

    onMonsterDelete(event) {
        if (this.boardController.getConfiguratorMonster()) {
            let monster = this.boardController.getConfiguratorMonster();
            // Delete the Link.
            eventDispatcher.clearListeners(
                `monster${monster.getAttribute("id")}`
            );
            // Delete the View and Model.
            this.boardController.removeMonster(monster);
            this.notifier.success("Monster successfully deleted!");
        } else {
            this.notifier.alert(
                "Please drop a monster in the configurator before deleting it!"
            );
        }
    }

    onError(message) {
        this.notifier.alert(
            `An error occured while loading the game data: "${message}". The application will now exit.`
        );
        this.hideLoading();
    }
}
