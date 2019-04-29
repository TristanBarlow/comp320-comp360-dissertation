/**
 * This class contains all of the data related to rooms placed in the map (rooms are made of tiles)
 */
class Room
{
    constructor(r_ticket, r_id, tiles, rect)
    {
        this.ticket = r_ticket;
        this.roomID = r_id;
        this.tiles = tiles;
        this.is_Locked = false;
        this.rect = rect;
        if(this.tiles && this.tiles[0] && this.roomID === R_START_ID)
        {
            this.tiles[0].props = [new Prop(P_PLAYER.ID, false, false)];
        }
    }

    /**
     * Gets the mid tile of this room
     * @returns {*}
     * @constructor
     */
    GetMiddleTile()
    {
        return this.tiles[Math.floor(this.tiles.length/2)];
    }

    /**
     * Gets a copy of all of the props currently placed in this room
     * @returns {Array} array of all of the props
     * @constructor
     */
    GetAllProps()
    {
        let props = [];
        for(let i = 0; i < this.tiles.length; i++)
        {
            props.push.apply(props, this.tiles[i].props);
        }
        return props;
    }

    /**
     * Gets if it can display ghost tiles or not
     * @returns {boolean} true if can ghost
     * @constructor
     */
    GetCanGhost()
    {
        for(let i = 0; i < this.tiles.length; i++)
        {
            if(this.tiles[i].props && this.tiles[i].props.length >0) return false;
        }
        return true;
    }

    /**
     * Gets the borders for the given room
     * @param x the pos of the border to get
     * @param y the pos of the broder to get
     * @returns {Array} array of borders
     * @constructor
     */
    GetBorders(x, y)
    {
        let border = [];
        if(x === this.rect.x )border.push(B_LEFT);
        if(x === this.rect.x + this.rect.w -1)border.push(B_RIGHT);

        if(y === this.rect.y)border.push(B_TOP);
        if(y === this.rect.y + this.rect.h-1) border.push(B_BOTTOM);

        return border;
    }

    Clone()
    {
        let r_copy = new Room(this.ticket,this.roomID, [], this.rect);
        for (let i = 0; i < this.tiles.length; i++)
        {

            r_copy.tiles.push(this.tiles[i].Clone());
        }

        r_copy.is_Locked = this.is_Locked;
        return r_copy;
    }
}