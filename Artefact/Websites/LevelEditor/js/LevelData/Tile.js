/**
 * Class that stores all of the data for each tile
 */
class Tile
{
    /**
     * constructor
     * @param x pos of tile
     * @param y pos of tile
     * @param r_ticket the room ticket of this tile
     * @param props the props of this tile
     * @param r_id  the ID of room this tile belongs to
     * @param is_ai true if the tile was placed by an AI
     */
    constructor(x,y,r_ticket,props, r_id , is_ai = false)
    {
        this.x = x;
        this.y = y;
        this.r_ticket = r_ticket || -1;
        this.r_id = r_id || -1;
        this.props =props || [];
        this.is_ai = is_ai;
    }

    /**
     * Function to call when a prop is added
     * @param p_id  the ID of the prop to add
     * @param AI true if the AI placed this prop
     * @returns {boolean} true if the prop was added
     */
    AddProp(p_id, AI = false)
    {
        if(this.CanProp())
        {
            this.props.push(new Prop(p_id, AI));
            return true;
        }
        return false;
    }

    /**
     * Gets if this tile can add more props
     * @returns {boolean} true if they can
     * @constructor
     */
    CanProp()
    {
        return this.props.length < PROPS_PER_TILE;
    }

    /**
     * Removes the last prop added to this tile
     * @returns {boolean} true if the prop was successfully removed
     */
    RemoveProp()
    {
        if(this.props.length > 0 && this.r_id !== R_START_ID)
        {
            return this.props.pop().p_id;
        }
        return false;
    }

    /**
     * Gets if this tile is in use
     * @returns {boolean} true if the tile is in use
     * @constructor
     */
    InUse()
    {
        return this.r_id !== R_WALL_ID;
    }

    /**
     * Clears this tile
     */
    Clear()
    {
        this.r_ticket = -1;
        this.r_id = -1;
        this.props = [];
        this.is_ai = false;
    }

    /**
     * Clears the props from this tile
     * @constructor
     */
    PropClear()
    {
        this.props = [];
    }

    /**
     * Function to call when this tile has been occupied
     * @param r_ticket  the ticket of the room this tile now belongs
     * @param r_id the id of the room
     * @param is_ai true if this tile was activated by the AI
     */
    OccupyTile(r_ticket, r_id, is_ai = false)
    {
        this.r_ticket = r_ticket;
        this.r_id = r_id;
        this.is_ai = is_ai;
    }

    /**
     * Returns a copy of this tiles props
     * @constructor
     */
    CopyProps()
    {
        let props = [];
        for(let i =0; i < props.length;i ++)
        {
            props.push(this.props[i].Clone());
        }
        return props;
    }

    /**
     * Returns the vector of this tile
     * @returns {Vector2} the vector
     */
    GetVec()
    {
        return new Vector2(this.x, this.y);
    }


    /**
     * Clones this
     * @returns {Tile} the cloned tile
     * @constructor
     */
    Clone()
    {
        return new Tile(this.x,this.y, this.r_ticket,this.props.slice(), this.r_id, this.is_ai);
    }
}