import BoardModel from "../model/BoardModel";

export default class BoardController {
    constructor() {
        this.model = new BoardModel();
    }

    async loadGameData() {
        let boardData = null;
        let monsterData = new Array();

        switch(this.model.getDataSource()) {
            case "api":
                boardData = await this.getBoardDataFromAPI();
                break;
            case "localStorage":
                boardData = this.getBoardDataFromLocalStorage();
                monsterData = this.getMonsterDataFromLocalStorage();
                break;
            default:
                throw new Error(`Data origin '${this.model.getDataSource()}' is undefined`);
        }

        // Continue with initializing the board.
        this.model.initializeBoard(boardData);
        this.model.initializeMonsters(monsterData);

        await this.sleep(1000);
    }

    async getBoardDataFromAPI() {
        return fetch("data/boardData.json")
            .then((response) => response.json());
    }

    getBoardDataFromLocalStorage() {
        let data = localStorage.getItem("boardData");
        return JSON.parse(data);
    }

    getMonsterDataFromLocalStorage() {
        let data = localStorage.getItem("monsterData");
        return JSON.parse(data);
    }

    getConfiguratorField() {
        return this.model.getConfiguratorField();
    }

    drawBoard() {

    }

    /**
     * Only to showcase my awesome loading gif.
     *
     * @param int ms
     */
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
