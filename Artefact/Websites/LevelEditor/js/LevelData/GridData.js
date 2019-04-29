/**
 * This class contains all the data to do with the grid, including tiles rooms and props
 */
class GridData
{
    constructor(width, height)
    {

        this.width = width;
        this.height = height;

        //A two dimensional array containing all of the tiles in grid
        this.tiles = [];

        //A dict of the unique rooms (start and end) but there is scope for more
        this.unique_rooms = {};

        //A dict of all the active rooms currently present, key = the room ticket, value has tiles and the room ID as
        this.active_rooms = {};
        this.counter = 1;

        //Rect of this grid
        this.rect = new Rect(0,0,this.width, this.height);

        //Ghost props
        this.ghost_tiles = {};

        this.InitEmptyGrid();

    }

    /**
     * Checks the unique rooms to see if the grid contains a room of that type
     * @param id  of the room to check for
     * @returns {boolean}
     * @constructor
     */
    HasRoom(id)
    {
        return this.unique_rooms.hasOwnProperty(id);
    }

    /**
     * Refreshes all of the tiles using the current active room dictionary as a basis
     * @constructor
     */
    RefreshTiles()
    {
        //Update the unique rooms
        this.unique_rooms = {};


        this.ClearAllTiles();

        for(let r_ticket in this.active_rooms)
        {
            if(this.active_rooms.hasOwnProperty(r_ticket))
            {
                let room_entry = this.active_rooms[r_ticket];
                let tiles = room_entry.tiles;
                let room = GVars.ObjectManager().GetObject(room_entry.roomID).value;


                //Add to the unique room dict
                if(room.isUnique)
                {
                    this.unique_rooms[room.ID] = r_ticket;
                }

                //Re-reference all the tiles in the tile array with the ones from the active rooms
                for(let i = 0; i < tiles.length; i++)
                {
                    let tile = tiles[i];
                    this.tiles[tile.y][tile.x] = tile;
                }
            }
        }
    }

    /**
     * Check to see if the grid will accept a placement of this room type
     * @param r_id  the id of the room to check
     * @returns {boolean}
     * @constructor
     */
    GetCanPlace(r_id)
    {
        let room = GVars.ObjectManager().GetRoom(r_id);
        if (!room.isUnique) return true;

        if(this.HasRoom(r_id))
        {
            HtmlBridge.AddNewLineToLog("There is already a " + room.name + " Tile");
            return false;
        }
        return true;
    }

    GhostProps(){return this.ghost_tiles;}

    /**
     * Clears the grid and room dictionaries
     * @constructor
     */
    InitEmptyGrid()
    {
        this.tiles = [];
        this.unique_rooms = {};
        this.counter =1;
        this.active_rooms = {};
        this.ghost_tiles = {};

        for(let y = 0; y < this.height ; y++)
        {
            let temp_arr = [];
            for(let x = 0; x < this.width ; x++)
            {
                temp_arr.push(new Tile(x,y));
            }
            this.tiles.push(temp_arr);
        }
    }

    /**
     * Samples a list of props for all of the given room_id, ignoring the given ticket
     * @param r_id       the room type to sample
     * @param room_ticket the room ticket to ignore
     * @constructor
     */
    GhostlySampleProps(r_id, room_ticket)
    {
        let positions = this.GetPosOfRoomsOfType(r_id, room_ticket);

        this.ghost_tiles = {};

        for(let i =0; i < positions.length; i ++)
        {
            //Get props and tiles
            let room = this.GetRoomAtPos(positions[i].x, positions[i].y);

            //Make sure this room can actually ghost
            if(!room.GetCanGhost()) continue;

            let tiles = room.tiles;

            let props = GVars.AI().Predictor().SampleAllRoom(r_id, tiles[0].r_ticket);

            //Check to see if no props were sampled.
            if(!props) continue;

            //Calculate lengths
            let counter =0;
            let props_per_tile = props.length/tiles.length;

            //Cycle through adding ghostly props
            for(let j = 0; j < tiles.length; j++)
            {
                let ticket = tiles[j].r_ticket;
                let g_tile = new GhostTile(tiles[j].GetVec(), [], tiles.r_ticket);

                if(this.ghost_tiles.hasOwnProperty(ticket))
                {
                    //push a new g_prop struct into the array
                    this.ghost_tiles[ticket].push(g_tile);
                }
                else
                {
                    //Add new key to dict
                    this.ghost_tiles[ticket] = [g_tile];
                }

                //Add the ghost props to the tile
                for (let z = 0; z < props_per_tile; z++)
                {
                    //Only add props if they're not blank
                    if(parseInt(props[counter]) !== P_CLEAR_ID)
                    {
                        g_tile.props.push(new Prop(props[counter], true, true));
                    }
                    counter++;
                }

            }

        }
    }


    /**
     * Applies the current ghost array tiles to their actual tile counterparts
     * @constructor
     */
    ApplyGhosts()
    {
        GVars.Memento().MapChanged(this);

        for(let ticket in this.ghost_tiles)
        {
            if(this.ghost_tiles.hasOwnProperty(ticket))
            {
                let tiles = this.ghost_tiles[ticket];
                for (let i = 0; i < tiles.length; i++)
                {
                    let pos = tiles[i].pos;

                    //get the map version of the props and add to the tile.
                    let ai_props = tiles[i].GetRealProps();
                    this.tiles[pos.y][pos.x].props = ai_props;

                    //Update the stats
                    GVars.Stats().MapStats().m_NumAIPlacedProps += ai_props.length;
                }
            }
        }
        this.ghost_tiles = {};
    }

    /**
     * Check to see if the incoming rect will be contained by the grid rect
     * @param rect to check
     * @returns {boolean}
     * @constructor
     */
    InBounds(rect)
    {
        return this.rect.CanContain(rect);
    }

    /**
     * Activates a single tile
     * @param tile     the tile to activate
     * @param r_ticket the room ticket of the room the tile will belong too
     * @param room      object containing the room information
     * @param is_ai  true if the ai is placing it
     * @constructor
     */
    ActivateTile(tile, r_ticket, room, is_ai = false)
    {
        //set room_entries in the tile class
        tile.OccupyTile(r_ticket, room.ID, is_ai);

        //check to see if there is already a room activated with that ticket
        if(!this.active_rooms.hasOwnProperty(r_ticket))
        {
            //create entry
            this.active_rooms[r_ticket] = new Room(r_ticket,room.ID, [tile], new Rect(tile.x, tile.y, room.size, room.size));
        }
        else
        {
            //add to existing entry
            this.active_rooms[r_ticket].tiles.push(tile);
        }

        if(is_ai)GVars.Stats().MapStats().m_NumAIPlacedTiles++;

        GVars.Stats().MapStats().m_NumPlacedTiles++;
    }

    /**
     * Returns the positions of the first tile of all the rooms of a given type
     * @param r_id  the ID of the rooms to search for
     * @param avoid_ticket  the ticket of the room to ignore
     * @returns {Array}  an array of positions of the tile locations
     * @constructor
     */
    GetPosOfRoomsOfType(r_id, avoid_ticket)
    {
        let locs = [];
        let keys = Object.keys(this.active_rooms);
        for(let i =0; i < keys.length; i++)
        {
            if(avoid_ticket && parseInt(keys[i]) === avoid_ticket)
            {
                //if avoid ticket is valid and the current roomticket is the avoid one do nothing
                continue;
            }

            // add the tile to the position list we're building
            let values = this.active_rooms[keys[i]];
            if (values.roomID === r_id) locs.push(new Vector2(values.tiles[0].x, values.tiles[0].y));
        }
        return locs;
    }

    /**
     * Returns all room tickets of any overlapping rooms of a given rect
     * @param rect to check for overlapping rooms
     * @constructor
     */
    GetOverlappingRoomTickets(rect)
    {
        let rooms = {};
        for(let j = rect.y; j < rect.y + rect.h; j++)
        {
            for(let i = rect.x; i < rect.x + rect.w; i++)
            {
                //add this ticket to the dict
                if(this.tiles[j][i].InUse()) rooms[this.tiles[j][i].r_ticket] = 1;
            }
        }
        return rooms;
    }

    /**
     * Removes room associated with the given room ticket
     * @param r_ticket
     * @constructor
     */
    RemoveRoom(r_ticket)
    {
        //make sure the active rooms has this ticket
        if(this.active_rooms.hasOwnProperty(r_ticket))
        {
            let room_entry = this.active_rooms[r_ticket];
            let tiles = room_entry.tiles;
            let room = GVars.ObjectManager().GetRoom(room_entry.roomID);

            //If the room is a unique one delete it from that dict too
            if(room.isUnique)
            {
                delete  this.unique_rooms[room.ID];
            }

            //clear all the tiles of this room
            tiles.forEach(function (tile)
            {
                tile.Clear();
            });

            delete  this.ghost_tiles[r_ticket];
            delete this.active_rooms[r_ticket];

            if(GVars.Stats().Settings().canAI)
            {
                if(GVars.AI().Predictor().RoomRemoved(room.ID, r_ticket))
                {
                   this.GhostlySampleProps(room.ID);
                }
            }

        }
    }

    /**
     * Checks if the grid contains everything to satisfy the settings
     * @param settings
     * @returns {{valid: boolean, reason: string}}
     * @constructor
     */
    CheckObjectNum(settings)
    {

        //If there are no mins returns
        if(settings.minTiles < 1 && settings.minProps <1)return {valid: true, reason: "good"};

        let prop_num = 0;
        let tile_num = 0;

        //loop through and calculate
        for(let key in this.active_rooms)
        {
            if(this.active_rooms.hasOwnProperty(key))
            {
                let tiles = this.active_rooms[key].tiles;
                tile_num += tiles.length;
                for(let i =0; i < tiles.length;i++)
                {
                    if(tiles[i].props)prop_num += tiles[i].props.length;
                }
            }
        }

        let b = prop_num >= settings.minProps && tile_num >= settings.minTiles;

        let str = "";
        if(prop_num < settings.minProps) str += "Minimum number of props not met, " + (settings.minProps - prop_num)+
                                               " more are needed. ";
        if(tile_num < settings.minTiles) str += "Minimum number of tiles not met, " + (settings.minTiles - tile_num)+
                                               " more are needed. ";

        return {valid :b , reason:str};
    }

    /**
     * Tries to place a prop at the given position
     * @param x position of the tile
     * @param y position of the tile
     * @param prop
     * @returns {boolean} if the prop was placed
     * @constructor
     */
    TryPlaceProp(x,y,prop)
    {
        if(GVars.ObjectManager().GetRoom(this.GetTilesRoomID(x,y)).canProp)
        {
            if(this.tiles[y][x].CanProp())
            {
                GVars.Memento().MapChanged(this);
                this.tiles[y][x].AddProp(prop.ID);

                //Update the number of props that have been placed
                GVars.Stats().MapStats().m_NumPlacedProps++;
                return true;
            }
        }
        return false;
    }

    /**
     * Tries to remove the last prop placed from a given table
     * @param x position of the tile
     * @param y position of the tile
     * @returns {boolean} true if a prop was removed
     * @constructor
     */
    TryRemoveProp(x,y)
    {
        if(this.tiles[y][x].props && this.tiles[y][x].props.length > 0)
        {
            GVars.Memento().MapChanged(this);
            return this.tiles[y][x].RemoveProp();
        }
        return false;
    }

    /**
     * Tries to place the room at the given position
     * @param x position of the tile
     * @param y position of the tile
     * @param room  the room to be placed
     * @param overwrite whether or not placing this room should remove other in its place
     * @param is_ai  if true
     * @returns {boolean} true if the rooms placed successful
     * @constructor
     */
    TryPlaceRoom(x, y, room, overwrite, is_ai = false)
    {
        //Make sure we can place the room
        if(!this.GetCanPlace(room.ID))
        {
            return false;
        }

        //check the current room will be in bounds at this location
        let roomRect = new Rect(x,y,room.size,room.size);
        if(!this.InBounds(roomRect))
        {
            HtmlBridge.AddNewLineToLog("Room " + room.name + " does not fit here!");
            return false;
        }

        //Check for overlapping rooms
        let overlappingRooms = this.GetOverlappingRoomTickets(roomRect);

        if(Object.keys(overlappingRooms).length > 0 && !overwrite)return false;

        //Check for trying to clear a clear tile, is so return
        if(room.ID === R_WALL_ID && this.GetTilesRoomID(x, y) === R_WALL_ID) return false;

        //If we're here we know we're going to update the map but not if its an AI placement
        if(!is_ai)
         GVars.Memento().MapChanged(this);

        //For all the overlapping rooms remove them
        for(let key in overlappingRooms)
        {
            if(overlappingRooms.hasOwnProperty(key))
            {
                this.RemoveRoom(key);
            }
        }

        //If this is a wall tile, all that needs to be done is the delete
        if(room.ID === R_WALL_ID)return true;

        this.PlaceRoom(x,y,room, is_ai);

        return true;
    }

    /**
     * Place the room at the given pos
     * @param x pos to place
     * @param y pos to place
     * @param room to place
     * @param is_ai true is the ai is placing the tile
     * @constructor
     */
    PlaceRoom(x, y, room, is_ai = false)
    {
        //loop through and activate the tiles
        for(let j = y; j <y+room.size; j++ )
        {
            for(let i = x; i <x+room.size; i++)
            {
                this.ActivateTile(this.tiles[j][i], this.counter, room, is_ai);
            }
        }

        //If its a unique room add it to the dict
        if(room.isUnique) this.unique_rooms[room.ID] = this.tiles[y][x].r_ticket;

        this.tiles[y][x].OccupyTile(this.counter, room.ID, is_ai);
        this.counter++;

        //Make sure we're not counting pathways as rooms
        if(room.ID !== R_PATH_ID )
            GVars.Stats().MapStats().m_NumPlacedRooms++;
    }

    /**
     * Place a room randomly on the grid
     * @param room to be placed
     * @returns {boolean} if the placement was successful
     * @constructor
     */
    PlaceRoomRandomly(room)
    {
        //Make a new randomised list of the tiles
        let tilesLeft = shuffle(this.GetTileArray());

        //Try to place the room a the given tiles
        for(let i = 0; i < tilesLeft.length; i++)
        {
            let tile =  tilesLeft[i];
            if(this.TryPlaceRoom(tile.x, tile.y, room, false, true))return true;
        }
        HtmlBridge.AddNewLineToLog("Sorry there I could not find any free space to place: " + room.name );
        return false;
    }

    /**
     * Tries to add the start and the end tile randomly
     * @returns {{start: (boolean|*), end: (boolean|*)}} if fields are true, it means that tile type was placed
     * @constructor
     */
    TryAddStartEnd()
    {
        let end = this.GetUniqueRoomLoc(R_END_ID);
        let start = this.GetUniqueRoomLoc(R_START_ID);

        if (!end)
        {
            if (this.PlaceRoomRandomly(GVars.ObjectManager().GetRoom(R_END_ID)))
            {
                end = this.GetUniqueRoomLoc(R_END_ID);
            }
            else end = false;
        }
        if(!start)
        {
            if (this.PlaceRoomRandomly(GVars.ObjectManager().GetRoom(R_START_ID)))
            {

                start = this.GetUniqueRoomLoc(R_START_ID);
            }
            else start = false;
        }
        return {start: start, end: end};

    }

    /**
     * Once given a path created by the AIs pathfinding element this function will turn it into a pathway
     * @param path  the path to be constructed
     * @constructor
     */
    ConstructPath(path)
    {
        //Sanity check the path
        if(!path || path.length< 1) return false;



        //Get the top of the path
        let current_node = path.pop();

        //Loop though placing pathway rooms until there are no more path nodes left
        while (path.length >0)
        {
            this.TryPlaceRoom(current_node.pos.x, current_node.pos.y, GVars.ObjectManager().GetRoom(R_PATH_ID),false, true);
            current_node = path.pop();
        }
    }

    /**
     * Make path from the closest point or the start to the end point
     * @param closestPoint to the end tile
     * @param from_start if the path is from the start or the end tile
     * @returns {boolean} returns true if it was successful
     * @constructor
     */
    MakeStartEndPath(closestPoint, from_start = true)
    {

        let start_pos;
        let goal;

        GVars.Memento().MapChanged(this);

        //If the start and end tiles dont exist place them
        let tiles = this.TryAddStartEnd();

        //If There is a valid end tile set it to its goal
        if(tiles.end) goal = tiles.end.GetVec();
        else          return false;

        //If there is a path and it is close use it instead of the start pos
        if(closestPoint) start_pos = closestPoint.pos;

        //If we have no closes point use the start tile
        else if(tiles.start) start_pos = tiles.start.GetVec();
        else return false;

        //Make sure both positions are valid
        if(!goal || !start_pos) return false;

        //If the path search was not from the start switch the goals
        if(!from_start && closestPoint)
        {
            goal = tiles.start.GetVec();
        }

        let distance = Vector2.Subtract(goal, start_pos);
        let x_dir = distance.x/Math.abs(distance.x);
        let y_dir = distance.y/Math.abs(distance.y);

        let current_pos = new Vector2(start_pos.x, start_pos.y);

        let path_room = GVars.ObjectManager().GetRoom(R_PATH_ID);

        //Draw the path to the end
        while(Math.abs(current_pos.x - goal.x) >0)
        {
            current_pos.x += x_dir;
            this.TryPlaceRoom(current_pos.x, current_pos.y, path_room, false, true);
        }

        while(Math.abs(current_pos.y - goal.y) >0)
        {
            current_pos.y += y_dir;
           this.TryPlaceRoom(current_pos.x, current_pos.y, path_room, false, true);
        }
        return true;
    }


    /**
     * Returns the room
     * @param x pos of the tile
     * @param y pos of the tile
     * @returns {int} the ID of room the tile belongs too
     * @constructor
     */
    GetTilesRoomID(x, y)
    {
        //If the tile is not in use, return the id for a wall
        if(!this.tiles[y][x].InUse())
        {
            return R_WALL_ID;
        }
        else
        {
            //If this active rooms contains the tiles room ticket return the roomID from
            //the associated with that ticket
            if(this.active_rooms.hasOwnProperty(this.tiles[y][x].r_ticket))
            {
                return this.active_rooms[this.tiles[y][x].r_ticket].roomID;
            }

            //If we're here it means the tile thinks it is active but the room no longer exists in active rooms
            //so we clear the tile
            else
            {
                this.tiles[y][x].Clear();
                return this.tiles[y][x].r_id;
            }
        }
    }

    /**
     * Returns if the tile is in use
     * @param x pos of the tile
     * @param y pos of the tile
     * @returns {boolean} if the tile is in use
     * @constructor
     */
    GetTileInUse(x,y)
    {
        return this.tiles[y][x].InUse();
    }


    /**
     * Get All the tiles to in the room to which this tiles belong
     * @param x pos of the tile
     * @param y pos of the tile
     * @returns {Array|*[]} the tiles
     * @constructor
     */
    GetTilesInRoom(x,y)
    {
        return this.active_rooms[this.tiles[y][x].r_ticket].tiles;
    }

    /**
     * Return ths room at the given position
     * @param x pos of the room
     * @param y pos of the room
     * @returns {*}
     * @constructor
     */
    GetRoomAtPos(x,y)
    {
        if(this.tiles[y][x].InUse())
        {
            return this.active_rooms[this.tiles[y][x].r_ticket];
        }
        else
        {
            return new Room(-1,-1, [], undefined);
        }
    }

    /**
     * Returns if the tile at pos can applu props
     * @param x pos of the tile
     * @param y pos of the tile
     * @returns {boolean} true if can prop
     * @constructor
     */
    GetTileCanProp(x,y)
    {
        return GVars.ObjectManager().GetRoom(this.tiles[y][x].r_id).canProp && this.tiles[y][x].CanProp();
    }

    /**
     * Returns if the tile at pos can applu props
     * @param x pos of the tile
     * @param y pos of the tile
     * @returns {Array[]} a copy of the prop array
     * @constructor
     */
    GetTileProps(x,y)
    {
        if(this.tiles[y][x].props.length>0)
        {
            return this.tiles[y][x].props.slice();
        }
        return false;
    }

    /**
     * Cuts the grid into the segement
     * @param min_x left side
     * @param max_x right side
     * @param min_y bottom
     * @param max_y top
     * @returns {Array}
     * @constructor
     */
    GetSlicedGrid(min_x, max_x, min_y, max_y)
    {
        let tile_array =[];
        for(let y=min_y; y < max_y; y++)
        {
            for (let x = min_x; x < max_x; x++)
            {
                tile_array.push(this.tiles[y][x]);
            }
        }
        return tile_array;
    }

    /**
     * Turns all the tiles into a one dimensional array
     * @returns {Array}
     * @constructor
     */
    GetTileArray()
    {
        return this.GetSlicedGrid(0,this.width,0, this.height);
    }

    /**
     * Completely clears all tiles from the grid
     * @constructor
     */
    ClearAllTiles()
    {
        for(let y = 0; y < this.height ; y++)
        {
            for(let x = 0; x < this.width ; x++)
            {
               this.tiles[y][x].Clear();
            }
        }
    }

    /**
     * Gets the unique tile of the given ID
     * @param roomID id of the room
     * @returns {tile} returns the tile of the room
     * @constructor
     */
    GetUniqueRoomLoc(roomID)
    {
        if(!this.HasRoom(roomID))return false;
        let room = this.active_rooms[this.unique_rooms[roomID]];
        return room.tiles[0];
    }

    /**
     * Gets the start and the end tile
     * @returns {{start: Tile, end: Tile}} tiles that are the start and the end
     * @constructor
     */
    GetStartAndEndTile()
    {
        if(this.HasRoom(R_START_ID) && this.HasRoom(R_END_ID))
        {
            let s = this.GetUniqueRoomLoc(R_START_ID);
            let e = this.GetUniqueRoomLoc(R_END_ID);

            return {start: s, end:e};
        }
        return false;
    }

}