/**
 * This class holds all of the data of the objects that can be placed into the level editor
 */
class LevelObjectManager
{
    constructor()
    {
        this.rooms = {};
        this.props = {};


        //Add the rooms to the dict and generate the buttons
        LevelObjectManager.AddObjectsToDict(this.rooms, ROOMS);
        HtmlBridge.GenerateRoomButtons(this.rooms);

        //Add the props to the dict and generate the prop buttons
        LevelObjectManager.AddObjectsToDict(this.props, PROPS);
        HtmlBridge.GeneratePropButtons(this.props);

        //Load the prop sprites
        this.InitPropImages();
    }

    /**
     * Adds the list of objects to the given dict
     * @param dict to add too
     * @param objects list of objects to add
     */
    static AddObjectsToDict(dict, objects)
    {
        for(let i = 0; i < objects.length;i++)
        {
            dict[objects[i].ID] = objects[i];
        }
    }

    /**
     *Inits all of the prop sprites in the prop dict
     */
    InitPropImages()
    {
        for(let key in this.props)
        {
            if(this.props.hasOwnProperty(key))
            {
                if(this.props[key].sprite &&this.props[key].sprite_name )
                {
                    this.props[key].sprite.src = 'Images/Game/' + this.props[key].sprite_name;
                }
            }
        }
    }

    /**
     * Adds a single room to the dict
     * @param room
     * @constructor
     */
    AddRoom(room)
    {
        this.rooms[room.ID] = room;
    }

    /**
     * Returns all of the prop IDs
     * @returns {string[]} the string of all available prop IDs
     * @constructor
     */
    GetPropIDs()
    {
        return Object.keys(this.props);
    }

    /**
     * Adds the given prop to the prop dict
     * @param prop prop to add
     * @constructor
     */
    AddProp(prop)
    {
        this.props[prop.ID] = prop;
    }

    /**
     * Returns the colour of the room
     * @param r_id   Id of the room
     * @returns {string|*} the colour
     * @constructor
     */
    GetTileColour(r_id)
    {
        return this.rooms[r_id].colour;
    }

    /**
     * Gets the room of a given ID
     * @param r_id ID of the room to get
     * @returns {*} room object
     */
    GetRoom(r_id){return this.rooms[r_id];}

    /**
     * Gets the prop of a given ID
     * @param p_id  the id of the prop to fetch
     * @returns {*} prop object
     */
    GetProp(p_id){return this.props[p_id];}

    /**
     * Gets an object either from the prop or the room dicts
     * @param id   the Id of the object to fecth
     * @returns {{type: string, value: object}} type is if its a prop or room, value is the object
     */
    GetObject(id)
    {

        if(this.rooms.hasOwnProperty(id))
        {
            return {type: R_TYPE, value: this.rooms[id]};
        }
        if(this.props.hasOwnProperty(id))
        {
            return {type: P_TYPE, value: this.props[id]};
        }
        return{type: "NONE", value: undefined};
    }
}