export default class FieldModel {
    constructor(x, y, regionName, canHaveOccupant) {
        this.x = x;
        this.y = y;
        this.regionName = regionName;
        this.canHaveOccupant = canHaveOccupant;
    }

    isHabitable() {
        return this.canHaveOccupant;
    }
}
