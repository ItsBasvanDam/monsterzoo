import ConfiguratorModel from "../model/ConfiguratorModel";
import BoardController from "./BoardController";
import ConfiguratorView from "../view/ConfiguratorView";
import TextInputView from "../view/TextInputView";
import SelectInputView from "../view/SelectInputView";
import SelectInputModel from "../model/SelectInputModel";
import eventDispatcher from "../util/EventDispatcher";
import TextInputModel from "../model/TextInputModel";
import FieldView from "../view/FieldView";
import MonsterView from "../view/MonsterView";

export default class MonsterController {
    constructor() {
        this.initialize();
    }

    async initialize() {
        this.boardController = new BoardController();

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
                    .catch(error => this.onError);
            })
            .catch(error => this.onError);
    }

    displayLoading() {
        document.querySelector("#loading").style.display = "block";
    }

    hideLoading() {
        document.querySelector("#loading").style.display = "none";
    }

    drawBoard() {
        this.boardController.drawBoard();
    }

    drawConfigurator() {
        this.onTextChange = this.onTextChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);

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

    prepareForm() {
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
        this.model.validateAll();
        this.view.addSubmit("Save Monster");
    }

    onTextChange(event) {
        this.model.setInputValue(event.target.id, event.target.value);
    }

    onSelectChange(event) {
        this.model.setInputValue(event.target.id, event.target.value);
        if (event.target.id == "monster-type") {
            this.prepareForm();
        }
        this.model.applyValidation(event.target.id);
    }

    onFormSubmit(event) {
        event.preventDefault();
        let newMonster = this.model.saveMonster(
            this.boardController.getConfiguratorMonster()
        );
        let monsterIndex = this.boardController.addMonster(newMonster);
        newMonster.setAttribute("id", monsterIndex);

        let editFieldModel = this.boardController.getConfiguratorField();
        let editField = document.querySelector(
            `td[data-x="${editFieldModel.x}"][data-y="${editFieldModel.y}"]`
        );

        editField.innerHTML = "";
        let newMonsterView = new MonsterView();
        newMonsterView.setData({
            x: -1,
            y: -1,
            regionName: "configurator",
            id: monsterIndex
        });
        // Link the model and the view.
        newMonsterView.setData = newMonsterView.setData.bind(newMonsterView);
        eventDispatcher.addListener(
            `monster${newMonster.getAttribute("id")}`,
            newMonsterView.setData
        );
        editField.append(newMonsterView);

        newMonster.setCurrentField(this.boardController.getConfiguratorField());
    }

    onError(message) {
        alert(
            `An error occured while loading the game data: "${message}". The application will now exit.`
        );
        this.hideLoading();
    }
}
