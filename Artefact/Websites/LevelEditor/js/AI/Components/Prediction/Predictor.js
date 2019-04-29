/**
 * Class used to store all the room models and fetch predictions and sample the room models
 */
class Predictor
{
    constructor()
    {
        this.room_models = {};
        this.last_predict = -1;
    }


    /**
     * Clears the room models
     * @constructor
     */
    Reset(){this.room_models = {};}

    /**
     * When a prop is updated in room
     * @param room
     * @param p_id the ID of the prop
     * @param r_ticket the room ticket of the prop just added
     * @param delta the amount the prop has been updated
     * @constructor
     */
    PropUpdated(room, p_id, r_ticket, delta)
    {
        let room_data = GVars.ObjectManager().GetRoom(room.roomID);

        //check to make sure the room exists in the model
        if(this.room_models.hasOwnProperty(room_data.ID))
        {
            //If is already present add to it
            this.room_models[room_data.ID].SimpleUpdateValue(p_id, r_ticket,room, delta);
        }
        else
        {
            //If its new create a new room model obj
            this.room_models[room_data.ID] = new RoomModel(room_data, A_ENTER, A_LEAVE);
            this.room_models[room_data.ID].SimpleUpdateValue(p_id, r_ticket,room, delta);
        }
    }


    /**
     * Checks to see if the room of the given ID can be sampled
     * @param r_id      room to check
     * @return {boolean}
     * @constructor
     */
    GetCanSampleRoom(r_id)
    {
        return this.room_models.hasOwnProperty(r_id) && this.room_models[r_id].CanSample() && GVars.Stats().Settings().canAI;
    }

    /**
     * Check to see if the room is currently used in a room mode;
     * @param r_id     the type of room to check
     * @param r_ticket the ticket of the room to check
     * @returns {boolean | *}   true if the room is used in the predictor
     * @constructor
     */
    IsRoomInModel(r_id, r_ticket)
    {
        return this.room_models.hasOwnProperty(r_id) && this.room_models[r_id].HasRoom(r_ticket);
    }

    /**
     * This function is called when a room is removed from the map, and thus needs to be removed from the model
     * @param r_id   the type of room to be removed
     * @param r_ticket the ticket of the room to be removed
     * @returns {boolean} returnts true if the room was removed
     * @constructor
     */
    RoomRemoved(r_id, r_ticket)
    {
        if(this.room_models.hasOwnProperty(r_id))
        {
            return this.room_models[r_id].TryRemoveRoomFromModel(r_ticket);
        }
        return false;
    }

    /**
     * Samples the entire room based on the room model
     * @param r_id  the room type to sample from
     * @param r_ticket the ticket of the room to sample
     * @returns An array of props for the room to be filled
     * @constructor
     */
    SampleAllRoom(r_id, r_ticket)
    {
        if(this.room_models.hasOwnProperty(r_id))
        {
            this.last_predict = r_id;
            return this.room_models[r_id].SampleAll(r_ticket);
        }
        else return false;
    }

    /**
     * Rests all of the seeds in all of the room models (to change the current ghost prop rolls)
     * @constructor
     */
    ResetSeeds()
    {
        for(let key in this.room_models)
        {
            if(this.room_models.hasOwnProperty(key))
            {
                this.room_models[key].ResetRoomSeeds();
            }
        }
    }
}