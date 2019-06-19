import BoardModel from "../model/BoardModel";
import BoardView from "../view/BoardView";
import SelectInputView from "../view/SelectInputView";
import FieldView from "../view/FieldView";

export default class BoardController {
    constructor(monsterController) {
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onRegionChange = this.onRegionChange.bind(this);

        this.regionViews = new Array();
        this.model = new BoardModel();
        this.monsterController = monsterController;
    }

    async loadGameData() {
        let boardData = null;
        let monsterData = new Array();

        switch (this.model.getDataSource()) {
            case "api":
                boardData = await this.getBoardDataFromAPI();
                break;
            case "localStorage":
                boardData = this.getBoardDataFromLocalStorage();
                monsterData = this.getMonsterDataFromLocalStorage();
                break;
            default:
                throw new Error(
                    `Data origin '${this.model.getDataSource()}' is undefined`
                );
        }

        // Continue with initializing the board.
        this.model.initializeBoard(boardData);
        this.model.initializeMonsters(monsterData);

        await this.sleep(1000);
    }

    async getBoardDataFromAPI() {
        return fetch("data/boardData.json").then(response => response.json());
    }

    getBoardDataFromLocalStorage() {
        let data = localStorage.getItem("boardData");
        return JSON.parse(data);
    }

    getMonsterDataFromLocalStorage() {
        let data = localStorage.getItem("monsterData");
        return JSON.parse(data);
    }

    addMonster(monsterModel) {
        return this.model.addMonster(monsterModel);
    }

    createConfiguratorField() {
        // The field you can drop monsters in to edit them.
        let editFieldModel = this.getConfiguratorField();
        let editField = new FieldView(
            editFieldModel.x,
            editFieldModel.y,
            "configurator",
            !editFieldModel.isHabitable()
        );
        editField.addListener("dragover", this.onDragOver);
        editField.addListener("drop", this.onDrop);
        return editField;
    }

    getConfiguratorField() {
        return this.model.getConfiguratorField();
    }

    getConfiguratorMonster() {
        return this.model.getConfiguratorMonster();
    }

    drawBoard() {
        this.view = new BoardView();
        this.view.addTitle("Regions");

        this.model.regions.forEach(region => {
            this.view.addRegionView(region.name, this.createRegionView(region));
        });

        let regionsPicker = new SelectInputView(
            "Region",
            "region",
            this.onRegionChange
        );
        regionsPicker.setOptions(this.model.getRegionNames());
        this.view.add(regionsPicker);

        // Finally, draw all the monsters to the board.
        this.model.monsters.forEach(monster => {
            this.view.displayMonster(monster);
        });
        regionsPicker.fireEvent("change");
    }

    createRegionView(regionData) {
        // Build a gridview for the region.
        let table = document.createElement("table");
        table.classList.add("table-responsive", "mt-2");
        let tableBody = document.createElement("tbody");

        for (let y in regionData.fields) {
            let newRow = document.createElement("tr");
            for (let x in regionData.fields[y]) {
                let fieldModel = regionData.fields[y][x];
                let newField = new FieldView(
                    fieldModel.x,
                    fieldModel.y,
                    regionData.name,
                    !fieldModel.canHaveOccupant
                );
                newField.addListener("dragover", this.onDragOver);
                newField.addListener("drop", this.onDrop);
                newRow.append(newField.getElement());
            }
            tableBody.append(newRow);
        }

        table.append(tableBody);
        return table;
    }

    onRegionChange(event) {
        let region = this.view.getRegionView(event.target.value);
        this.view.setCurrentRegion(region);
    }

    onDrop(event) {
        let xFrom = event.dataTransfer.getData("x");
        let yFrom = event.dataTransfer.getData("y");
        let regionNameFrom = event.dataTransfer.getData("regionName");
        let monsterId = event.dataTransfer.getData("id");

        let xTo = event.target.getAttribute("data-x");
        let yTo = event.target.getAttribute("data-y");
        let regionNameTo = event.target.getAttribute("data-region-name");
        let fieldTo = this.model.getField(regionNameTo, xTo, yTo);

        // Get the dragged monster.
        let monster = this.model.getMonster(regionNameFrom, xFrom, yFrom);
        // Set its new position.
        monster.setCurrentField(fieldTo);
        let fieldToView = document.querySelector(
            `td[data-x="${fieldTo.x}"][data-y="${
                fieldTo.y
            }"][data-region-name="${regionNameTo}"]`
        );
        fieldToView.appendChild(document.getElementById(monsterId));

        if (fieldTo.x == -1 && fieldTo.y == -1) {
            // The monster has been dragged to the configurator.
            this.monsterController.setFormMonster(monster);
        }
        // Save all the data to localStorage.
        this.model.saveDataToLocalStorage();
    }

    onDragOver(event) {
        let x = event.target.getAttribute("data-x");
        let y = event.target.getAttribute("data-y");
        let regionName = event.target.getAttribute("data-region-name");
        let field = this.model.getField(regionName, x, y);
        if (field && !this.model.isFieldOccupied(field)) {
            event.preventDefault();
        }
    }

    // onDragStart(event) {
    //     console.log(event);
    //     // event.dataTransfer.setData();
    // }

    /**
     * Only to showcase my cool loading gif.
     *
     * @param int ms
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
