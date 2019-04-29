/**
 * This class is for each room entry in a room model and is used to keep track of the props and ratios inside the
 */
class RoomEntry
{
    constructor(r_ticket, props, max_props)
    {
        //the ticket of the room that is associated with this room model
        this.ticket = r_ticket;
        this.prop_values = {};

        this.max_props = max_props;
        this.prop_num  = props.length;

        //If the room has props, go through and setup the dict
        if(props)
        {
            //Create the dict of the props and their room_entries
            for (let i = 0; i < props.length; i++) {
                //Update entry if one exists
                if (this.prop_values.hasOwnProperty(props[i].p_id))
                {
                    this.prop_values[props[i].p_id]++;
                }
                else
                    {
                    this.prop_values[props[i].p_id] = 1;
                }
            }
        }
    }

    /**
     * returns the number of spaces in this room model
     * @returns {number} the number of spaces
     * @constructor
     */
    GetSpaces()
    {
        return this.max_props - this.prop_num;
    }

    /**
     * Updates the value of the prop in the room entry returns true if this entry should be deleted
     * @param prop_id  the ID of the prop to update
     * @param delta  the amount to change on the prop
     * @returns {boolean}  true if the room model is now empty
     * @constructor
     */
    UpdateProp(prop_id, delta)
    {
        this.prop_num += delta;

        if(this.prop_values.hasOwnProperty(prop_id))
        {
            this.prop_values[prop_id] += delta;
        }
        else
        {
            this.prop_values[prop_id] = delta;
        }

        if (this.prop_values[prop_id] >= 1) return false;

        delete this.prop_values[prop_id];

        return this.prop_num <= 0;
    }

    /**
     * Performs a deep clone on this room entry
     * @returns {RoomEntry}
     * @constructor
     */
    Clone()
    {
        let obj = new RoomEntry(this.ticket,false, this.max_props);
        obj.prop_num = this.prop_num;
        AddDictValues(obj.prop_values, this.prop_values);
        return obj;
    }
}