export default class FieldModel {
    constructor(x, y, canHaveOccupant) {
        this.x = x;
        this.y = y;
        this.canHaveOccupant = canHaveOccupant;
    }

    isHabitable() {
        return this.canHaveOccupant;
    }
}
