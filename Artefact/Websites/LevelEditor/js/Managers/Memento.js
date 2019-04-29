/**
 * This class is used to track the history of the level editor
 */
class Memento
{
    constructor()
    {
        this.max_grid_history = S_MAX_HISTORY;
        this.history = [];
        this.undo_history = [];
    }

    /**
     *Clears the entire history
     */
    Clear()
    {
        this.history = [];
        this.undo_history =[];
    }

    /**
     * Called when the map changes, this will updated the history
     * @param grid the grid to be added into the history
     */
    MapChanged(grid)
    {

        if (this.history.length >= this.max_grid_history)
        {
            this.history.shift();

        }
        this.history.push(Memento.MakeData(grid, GVars.AI().Predictor()));
        this.undo_history = [];
    }

    /**
     * Creats the data struct that gets added into the history
     * @param grid  the grid to grab the room data from
     * @param predictor the ai predictor to grab the room models from
     * @param prop_ghosts  the ghost props that were generated with the
     * @returns {{rooms, models}} the data struct to be added to the history
     * @constructor
     */
    static MakeData(grid, predictor)
    {
        return {
            rooms: Memento.CloneRooms(grid.active_rooms),
            predictor: {last: predictor.last_predict, room_models: Memento.CloneRoomModels(predictor.room_models)},
            ghost_props: Memento.CloneGhostTiles(grid.ghost_tiles)
        };
    }

    /**
     * Undos the grid and the predictor provided
     * @param grid  the grid to undo on
     * @param predictor the predictor to undo on
     * @returns {boolean} true if the undo was successful
     */
    Undo(grid, predictor)
    {
        if (this.history.length > 0)
        {
            let undo = this.history.pop();
            this.undo_history.push(Memento.MakeData(grid, predictor));

            //ApplyUndo to grid
            grid.active_rooms = undo.rooms;
            grid.RefreshTiles();

            //apply undo to room models
            predictor.room_models = undo.predictor.room_models;

            //apply the ghost tiles
            grid.ghost_tiles = undo.ghost_props;
            return true;
        }
        return false;
    }

    /**
     * Applies a redo to the grid and the predictor provided
     * @param grid   the grid to apply the redo on
     * @param predictor  the predictor to apply the redo on
     * @returns {boolean} true if the redo was successful
     * @constructor
     */
    Redo(grid, predictor)
    {
        if (this.undo_history.length > 0)
        {
            let redo = this.undo_history.pop();
            this.history.push(Memento.MakeData(grid, predictor));

            //Apply redo
            grid.active_rooms = redo.rooms;
            grid.RefreshTiles();

            //Apply redo to predictor
            predictor.room_models = redo.predictor.room_models;
            predictor.last_predict = redo.predictor.last;

            //apply the ghost tiles
            grid.ghost_tiles = redo.ghost_props;
            return true;
        }
        return false;
    }

    /**
     * Returns a clone of the rooms provided
     * @param rooms  the rooms to clone
     * @return Object returns a dictionary of the cloned rooms
     */
    static CloneRooms(rooms)
    {
        let r_copy = {};
        for (let r_ticket in rooms)
        {
            if (rooms.hasOwnProperty(r_ticket))
            {
                r_copy[r_ticket] = rooms[r_ticket].Clone();
            }
        }
        return r_copy;
    }

    /**
     * Clones the room models of the predictor
     * @param models the room models to clone
     */
    static CloneRoomModels(models)
    {
        let m_copy = {};

        for(let r_id in models)
        {
            if(models.hasOwnProperty(r_id))
            {
                m_copy[r_id] = models[r_id].Clone();
            }
        }
        return m_copy;
    }

    static CloneGhostTiles(g_tiles)
    {
        let g_copy = {};

        //Go through original g_tiles and clone
        for(let r_tick in g_tiles)
        {
            if(g_tiles.hasOwnProperty(r_tick))
            {
                g_copy[r_tick] = [];

                for(let i = 0; i < g_tiles[r_tick].length;i++)
                {
                    g_copy[r_tick].push(g_tiles[r_tick][i].Clone());
                }
            }
        }

        return g_copy;
    }
}

