/**
 * Ghost tiles mirror their actual counter parts and host the ghost tiles
 */
class GhostTile
{
    constructor(pos, props, r_ticket)
    {
        this.pos = pos;
        this.props = props || [];
        this.r_ticket = r_ticket;
    }

    /**
     * Clones the ghost tile
     * @returns {GhostTile} the clone of this ghost tile
     * @constructor
     */
    Clone()
    {
        //create the new tile
        let gt = new GhostTile(this.pos.clone(), [], this.r_ticket);

        //add the props
        for(let i =0; i < this.props.length; i++)
        {
            gt.props.push(this.props[i].Clone());
        }
        return gt;
    }

    /**
     * Turns all of the ghost props in this tile into real props
     * @returns {Array}
     * @constructor
     */
    GetRealProps()
    {
        let props = [];
        for(let i =0; i < this.props.length; i++)
        {
            props.push(new Prop(this.props[i].p_id, true, false));
        }
        return props;
    }
}