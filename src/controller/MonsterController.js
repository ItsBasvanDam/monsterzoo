import ConfiguratorModel from "../model/ConfiguratorModel";
import BoardController from "./BoardController";
import ConfiguratorView from "../view/ConfiguratorView";
import TextInputView from "../view/TextInputView";
import SelectInputView from "../view/SelectInputView";
import SelectInputModel from "../model/SelectInputModel";
import eventDispatcher from "../util/EventDispatcher";

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
                this.model.getData().then(() => {
                    this.model.setConfiguratorField(configuratorField);

                    this.drawConfigurator();
                    this.drawBoard();
                })
                .catch((error) => {
                    this.error(error);
                });
            })
            .catch((error) => {
                this.error(error);
            });
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
        this.view = new ConfiguratorView();
        this.view.addTitle("Monster Configurator");
        this.view.addToFixedSection(new TextInputView("Name", "name"));

        let newSelectInputModel = new SelectInputModel("Monster Type", "monster-type");
        let newSelectInputView = new SelectInputView(newSelectInputModel.name, newSelectInputModel.id, this.onSelectChange);
        // Link the View and Model using an EventDispatcher in Singleton-scope.
        newSelectInputView.change = newSelectInputView.change.bind(newSelectInputView);
        eventDispatcher.addListener(newSelectInputModel.id, newSelectInputView.change);
        newSelectInputModel.setOptions(this.model.getMonsterTypes());

        this.model.addInput(newSelectInputModel);
        this.view.addToFixedSection(newSelectInputView);
    }

    onSelectChange(event) {
        console.log(event.target);
    }

    error(message) {
        alert(
            `An error occured while loading the game data: "${message}". The application will now exit.`
        );
        this.hideLoading();
    }
}
