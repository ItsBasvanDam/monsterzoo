import ConfiguratorModel from "../model/ConfiguratorModel";
import BoardController from "./BoardController";
import ConfiguratorView from "../view/ConfiguratorView";
import TextInputView from "../view/TextInputView";
import SelectInputView from "../view/SelectInputView";

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

        this.view.addToFixedSection(
            new SelectInputView("Monster Type", "monster-type")
        );
    }

    error(message) {
        alert(
            `An error occured while loading the game data: "${message}". The application will now exit.`
        );
        this.hideLoading();
    }
}
