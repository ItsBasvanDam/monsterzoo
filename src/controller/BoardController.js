import BoardModel from "../model/BoardModel";
import BoardView from "../view/BoardView";
import SelectInputView from "../view/SelectInputView";
import FieldView from "../view/FieldView";
import MonsterView from "../view/MonsterView";
import eventDispatcher from "../util/EventDispatcher";
import { WeatherEnum } from "../util/helpers";

export default class BoardController {
    constructor(monsterController) {
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onRegionChange = this.onRegionChange.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMonsterClick = this.onMonsterClick.bind(this);

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

    removeMonster(monsterModel) {
        // Remove the View.
        let field = this.getConfiguratorField();
        let fieldView = this.view.getFieldView(
            field.x,
            field.y,
            field.regionName
        );
        fieldView.innerHTML = "";
        // Remove the Model.
        this.model.removeMonster(monsterModel.getAttribute("id"));
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
            this.displayMonster(monster);
        });
        regionsPicker.fireEvent("change");
    }

    displayMonster(monsterData, fieldModel = null) {
        let x, y, regionName;
        if (fieldModel != null) {
            x = fieldModel.x;
            y = fieldModel.y;
            regionName = fieldModel.regionName;
        } else {
            x = monsterData.currentField.x;
            y = monsterData.currentField.y;
            regionName = monsterData.currentField.regionName;
        }
        if (this.view.getRegionView(regionName)) {
            this.view.setCurrentRegion(this.view.getRegionView(regionName));
        }

        let field = document.querySelector(
            `td[data-x="${x}"][data-y="${y}"][data-region-name="${regionName}"]`
        );
        field.innerHTML = "";
        let newMonsterView = new MonsterView();
        newMonsterView.addEventListener("dragstart", this.onDragStart);
        newMonsterView.addEventListener("mouseenter", this.onMouseEnter);
        newMonsterView.addEventListener("mouseleave", this.onMouseLeave);
        newMonsterView.addEventListener("click", this.onMonsterClick);
        newMonsterView.setData({
            x: x,
            y: y,
            regionName: regionName,
            id: monsterData.getAttribute("id"),
            imageSrc: monsterData.getAttribute("image")
        });
        // Link the model and the view.
        newMonsterView.setData = newMonsterView.setData.bind(newMonsterView);
        eventDispatcher.addListener(
            `monster${monsterData.getAttribute("id")}`,
            newMonsterView.setData
        );
        field.append(newMonsterView);
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

    triggerAdjacentMonsters(centerField) {
        let monsters = this.model.getAdjacentMonsters(centerField);
        monsters.forEach(monster => {
            let monsterView = document.getElementById(
                monster.getAttribute("id")
            );
            monsterView.showAlert();
        });
    }

    monsterHasThePower(monsterType) {
        if (this.weather) {
            let weather = this.weather.weather;
            // Return whether a monster of a type is able to do their
            // special move, based on the type of the current weather
            // in the region they are in.
            switch (monsterType) {
                case "fire":
                    return weather == WeatherEnum.thunderstorm || weather == WeatherEnum.clear;
                case "earth":
                    return weather == WeatherEnum.snow;
                case "water":
                    return weather == WeatherEnum.rain || weather == WeatherEnum.drizzle;
                case "air":
                    return weather == WeatherEnum.clouds;
            }
        }
        return false;
    }

    onRegionChange(event) {
        let region = this.view.getRegionView(event.target.value);
        this.view.setCurrentRegion(region);
        this.monsterController
            .getWeather(this.model.getRegion(event.target.value).referenceCity)
            .then(weather => {
                this.monsterController.setWeather(weather);
                this.weather = weather;
            });
    }

    onDrop(event) {
        let monsterId = event.dataTransfer.getData("id");

        let xTo = event.target.getAttribute("data-x");
        let yTo = event.target.getAttribute("data-y");
        let regionNameTo = event.target.getAttribute("data-region-name");
        let fieldTo = this.model.getField(regionNameTo, xTo, yTo);

        // Get the dragged monster.
        let monster = this.model.getMonsterById(monsterId);
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
        } else {
            // Save all the data to localStorage.
            this.model.saveDataToLocalStorage();
            this.triggerAdjacentMonsters(fieldTo);
        }
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

    onDragStart(event) {
        event.dataTransfer.setData("id", event.target.id);
        event.target.hideInfo();
    }

    onMouseEnter(event) {
        let monsterData = this.model.getMonsterById(event.target.id);
        event.target.displayInfo(monsterData);
    }

    onMouseLeave(event) {
        event.target.hideInfo();
    }

    onMonsterClick(event) {
        event.target.hideInfo();
        let monsterType = this.model
            .getMonsterById(event.target.id)
            .getAttribute("monster-type");
        if (this.monsterHasThePower(monsterType)) {
            event.target.animateReaction(monsterType);
        }
    }

    /**
     * Only to showcase my cool loading gif.
     *
     * @param int ms
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
