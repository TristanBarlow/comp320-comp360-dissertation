/**
 * This class holds all the information to do with the prop
 */
class Prop {

    constructor(p_id, AI_placed = false, ghostly = false) {
        this.p_id = p_id;
        this.AI_placed = AI_placed;
        this.is_Ghostly = ghostly;
    }

    Clone()
    {
        return new Prop(this.p_id, this.AI_placed, this.is_Ghostly);
    }
}
