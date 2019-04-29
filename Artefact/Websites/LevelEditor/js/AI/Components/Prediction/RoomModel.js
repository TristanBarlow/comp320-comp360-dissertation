/**
 * This class hosts all of the room entries, that combined make up a room model
 */
class RoomModel
{

    constructor(room_data)
    {
        this.ID              = room_data.ID;
        this.room            = room_data;
        this.max_props       = this.room.size * this.room.size * PROPS_PER_TILE;
        this.min_data_points = 0;
        this.room_entries    = {};
        this.values          = {};
        this.room_seeds      = {};
        this.isFresh         = false;
        this.data_points     = 0;
        this.position_model = {};

    }


    /**
     * Gets if this model has enough data to be sampled
     * @returns {boolean}
     * @constructor
     */
    CanSample()
    {
        return this.data_points >= this.min_data_points;
    }

    /**
     * Regenerates all of the random seeds for the rooms
     * @constructor
     */
    ResetRoomSeeds()
    {
        for(let key in this.room_seeds)
        {
            //Make sure they're properties we actually want
            if(!this.room_seeds.hasOwnProperty(key))continue;

            this.room_seeds[key] =  Math.floor(Math.random() * 10000);
        }
        this.isFresh = false;
    }

    /**
     * Adds the value of the prop ID to the room modes
     * @param p_id      The id of the prop
     * @param r_ticket   the ticket of the room, only used in the case of an autofill
     * @param room
     * @param delta
     * @constructor
     */
    SimpleUpdateValue(p_id, r_ticket, room, delta)
    {

        if(this.room_entries.hasOwnProperty(r_ticket))
        {
            //update the prop, if false comes back we know the room does not have any props left so it should
            //be deleted
            if(this.room_entries[r_ticket].UpdateProp(p_id, delta))
            {
                delete this.room_entries[r_ticket];
            }
        }
        else
        {
            //There is a new room that has been interacted with so add it to the room entries
            let props = room.GetAllProps();
            this.room_entries[r_ticket] = new RoomEntry(r_ticket,props ,this.max_props);
        }

        this.isFresh = false;

        //Attempts to sample props
        if(this.CanGhost()&& r_ticket)
        {
            GVars.LevelViewer().Grid().GhostlySampleProps(this.ID, r_ticket);
        }
    }

    /**
     * Checks to see if this room model contains a room with the supplied ticket
     * @param r_ticket the ticket to check
     * @returns {boolean} true if the room is in the dictionary
     * @constructor
     */
    HasRoom(r_ticket)
    {
        return this.room_entries.hasOwnProperty(r_ticket);
    }

    /**
     * Returns true if the Ghosting requirements are met
     * @constructor
     */
    CanGhost()
    {
        return  S_GHOST;
    }

    /**
     * Updates the position models to the current state of map
     * @constructor
     */
    RefreshPosModel()
    {
        //get all of the active rooms
        let all_rooms = GVars.LevelViewer().Grid().active_rooms;
        this.position_model = {};

        for(let key in this.room_entries)
        {
            //Make sure these are the properties we want
            if(!this.room_entries.hasOwnProperty(key))continue;

            if(all_rooms.hasOwnProperty(key))
            {
                //Get the origin tile
                let tiles = all_rooms[key].tiles;
                let origin = new Vector2(tiles[0].x, tiles[0].y);

                //Loop through the tiles in this room
                for(let i =0; i < tiles.length; i++)
                {
                    //Convert the pos into a  localised string
                    let loc = Vector2.ToString(tiles[i].x - origin.x , tiles[i].y - origin.y);

                    //Create the tile entry if non exists
                    if(!this.position_model.hasOwnProperty(loc))
                    {
                        this.position_model[loc] = {ids: {}, samples: []};

                    }

                    //If the tile location exists fill in the requisite tiles
                    for(let j =0; j < PROPS_PER_TILE;j++)
                    {
                        let prop = P_CLEAR_ID;
                        if(tiles[i].props.length-1 >= j)
                        {
                            prop = tiles[i].props[j].p_id;
                        }

                        //Add the prop to the array
                        this.position_model[loc].samples.push(prop);
                        this.position_model[loc].ids[prop] = 1;
                    }
                }
            }
        }

        this.isFresh = true;
    }

    /**
     * Gets the room seed for the given room if none is present one will be generated
     * @param r_ticket the ticket of the room to get the seed for
     * @returns {*}  returns seed for the room.
     * @constructor
     */
    GetRoomSeed(r_ticket)
    {
        // If we dont have aseed for this room create one
        if(!this.room_seeds.hasOwnProperty(r_ticket))
        {
            this.room_seeds[r_ticket] = Math.floor(Math.random() * 10000);
        }

        //Return the seed
        return this.room_seeds[r_ticket];
    }

    /**
     * Samples entire room for props
     * @returns array  of the prop IDs
     * @constructor
     */
    SampleAll(r_ticket)
    {
        //Check to see if the room we're trying to sample is used in the memory model if so ignore
        if(this.room_entries.hasOwnProperty(r_ticket))
        {
            return false;
        }

        //If there have been updates to any of the room models, refresh!
        if(!this.isFresh)this.RefreshPosModel();

        let r_props = [];

        //Get the rng class for the given ticket
        let rng = new RNG(this.GetRoomSeed(r_ticket));

        //Loop through the entire position model and generate the props
        for(let key in this.position_model)
        {
            //see if there is an antry for this pos, if no continue
            if(!this.position_model.hasOwnProperty(key))continue;

            //If its a novel search, turn the model novel
            if(GVars.Stats().Settings().isNovel)
            {
                RoomModel.TurnModelNovel(rng, this.position_model[key]);
            }

            //go through the model and get a random entry to the length
            let arr = this.position_model[key].samples;
            let length  = arr.length;
            for(let i = 0; i < PROPS_PER_TILE; i ++)
            {
                r_props.push(arr[rng.nextRange(0,length)]);
            }
        }
        return r_props;
    }

    /**
     * Samples inversely to what the player has actually placed.
     * @param rng the rng to be used to generate the novel paths
     * @param pos_model the model to be turned random
     * @return {*}
     */
    static TurnModelNovel(rng, pos_model)
    {
        let all_props = GVars.ObjectManager().GetPropIDs();

        //Remove all of the IDs that are in there
        for(let i =0; i < all_props.length; i ++)
        {
            if(pos_model.ids.hasOwnProperty(all_props[i]) || !GVars.ObjectManager().GetProp(all_props[i]).can_place)
                all_props.splice(i,1);
        }
        //Randomly sample from the available props
        for(let i =0; i <pos_model.samples.length; i++)
        {
            if(pos_model.samples[i] === P_CLEAR_ID)continue;
            pos_model.samples[i] = all_props[rng.nextRange(0,all_props.length)];
        }

    }


    /**
     * Returns the number of rooms stored in this room model
     * @returns {number}
     * @constructor
     */
    GetNumRoomsInModel()
    {
        return Object.keys(this.room_entries).length;
    }


    /**
     * Refreshes the model to be up  to date with the current rooms stored inside it
     * @constructor
     */
    RefreshValues()
    {
        //clear values
        this.values = {};
        this.values[P_CLEAR_ID] = 0;
        this.data_points = 0;

        //get all of the room entries
        let keys = Object.keys(this.room_entries);
        for(let i =0; i < keys.length; i++)
        {
            let key = keys[i];
            if(this.room_entries.hasOwnProperty(key))
            {
                //combine dicts
                let prop_vals = this.room_entries[key].prop_values;
                AddDictValues(this.values, prop_vals);

                //set up default values
                this.values[P_CLEAR_ID] += this.room_entries[key].GetSpaces();
                this.data_points += this.room_entries[key].prop_num;
            }
        }
        this.isFresh = true;
    }

    /**
     * deep Clones this room model
     * @returns {RoomModel} clone
     * @constructor
     */
    Clone()
    {
        //init the new room mode
        let clone = new RoomModel(this.room);

        //duplicate the number of data points
        clone.data_points = this.data_points;

        //Loop through all of the room entries and copy them into the clones room_entries
        for(let key in this.room_entries)
        {
            if(this.room_entries.hasOwnProperty(key)) clone.room_entries[key] = this.room_entries[key].Clone();
        }

        //Clone the room seeds
        clone.room_seeds = ObjClone(this.room_seeds);

        //Refresh the values for use
        clone.RefreshValues();
        return clone;
    }

    /**
     * Removes the room from the room model
     * @param r_ticket the ticket of the room to be removed
     * @returns {boolean}
     * @constructor
     */
    TryRemoveRoomFromModel(r_ticket)
    {
        //Check the room is in the entries
        if(this.room_entries.hasOwnProperty(r_ticket))
        {
            delete this.room_entries[r_ticket];
            this.isFresh = false;
            return true;
        }
        return false;
    }

}

try {
    module.exports = {RoomModel};
} catch (e) {}