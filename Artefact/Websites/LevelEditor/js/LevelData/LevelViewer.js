/**
 * The class handles everything to do with drawing the grid, inaddition hosts the controls for
 * interacting with the grid
 */
class LevelViewer
{
    /**
     * constructor
     * @param width
     * @param height
     * @param tile_spacing
     */
    constructor(width, height, tile_spacing)
    {
        this.width = width;
        this.height = height;
        this.grid = new GridData(width, height);
        this.object_ID = R_START_ID;
        this.tile_spacing = tile_spacing;

        this.focus_pos = new Vector2(0,0);
        this.is_focus = false;

        this.path = undefined;
        this.path_col = '#ff0022';

        //Init draw objects
        this.grid_draw_objects =[];
        for(let i = 0; i < (this.height * this.width); i ++)
        {
            this.grid_draw_objects.push(new SpriteDrawObject(0));
        }
    }

    /**
     * Draws the grid
     * @constructor
     */
    DrawGrid()
    {
        //Get current canvas size
        let canvasRect  = GAZCanvas.canvas_size;
        this.x_size =  canvasRect.w/this.width;
        this.y_size =  canvasRect.h/this.height;

        //Update the draw objects based on the tiles
        let i =0;
        for(let y = 0; y < this.height; y++)
        {
            for(let x = 0; x < this.width; x++)
            {
                let tile = this.Grid().tiles[y][x];
                let roomID = tile.r_id;

                //Update the tile
                this.grid_draw_objects[i].Update(GVars.ObjectManager().GetTileColour(roomID), this.grid.GetTileProps(x,y));

                //update drawObj rect
                this.rect = this.SetDrawRect(x, y, this.grid_draw_objects[i].my_rect,this.Grid().GetTileInUse(x, y));
                //this.SetDrawRect(x, y, this.grid_draw_objects[i].my_rect, this.Grid().GetTileInUse(x, y));

                //Check for room in room model to draw outline
                if(GVars.Stats().Settings().canAI && GVars.AI().Predictor().IsRoomInModel(roomID,tile.r_ticket))
                {
                    this.grid_draw_objects[i].border = this.Grid().GetRoomAtPos(x,y).GetBorders(x, y);
                }

                i++;
            }
        }

        //ApplyGhostlyProps
        if(this.Grid().GhostProps())
        {
            let g_tiles = this.Grid().GhostProps();
            for(let ticket in g_tiles)
            {
                if(g_tiles.hasOwnProperty(ticket))
                {
                    let tiles = g_tiles[ticket];
                    for (let i = 0; i < tiles.length; i++)
                    {
                        let vec = tiles[i].pos;
                        let draw_tile = this.grid_draw_objects[this.GetDrawObjIndex(vec.x, vec.y)];

                        draw_tile.props = tiles[i].Clone().props;
                    }
                }
            }
        }

        //Update the highlighted tiles
        if(this.is_focus)
        {
            //Get the active object type
            let response = GVars.ObjectManager().GetObject(this.object_ID);

            switch (response.type)
            {
                case R_TYPE:
                {
                    this.DrawHighlightRoom(response.value);
                    break;
                }
                case P_TYPE:
                {
                    //Check to see if the prop is the clear prop
                    if(this.object_ID === P_CLEAR_ID)
                    {
                        let index = (this.focus_pos.y * this.width) + this.focus_pos.x;
                        this.grid_draw_objects[index].props.pop();
                        break;
                    }

                    //Add the prop to the draw objects props if it takes them
                    if(this.grid.GetTileCanProp(this.focus_pos.x, this.focus_pos.y))
                    {

                        this.grid_draw_objects[this.GetDrawObjIndex(this.focus_pos.x, this.focus_pos.y)].FocusProp(new Prop(response.value.ID, false));
                    }
                    break;
                }
            }
        }

        //Draw all of the draw objects
        for(let i=0; i < this.grid_draw_objects.length; i++)
        {
            this.grid_draw_objects[i].Draw();
        }

        //Draw path
        this.DrawPath();
    }

    /**
     *
     * @param x
     * @param y
     * @returns {*}
     * @constructor
     */
    GetDrawObjIndex(x, y)
    {
        return (y * this.width) + x;
    }

    /**
     * Alter the draw objects to show where the room will be placed
     * @param room the room to be placed
     */
    DrawHighlightRoom(room)
    {
        for(let y = this.focus_pos.y; y < this.focus_pos.y + room.size; y++)
        {
            for (let x = this.focus_pos.x; x < this.focus_pos.x + room.size; x++)
            {
                if(!this.grid.rect.isInMe(new Vector2(x,y))) continue;

                let index = (y * this.width) + x;
                this.grid_draw_objects[index].Update(room.colour);
                this.SetDrawRect(x,y,this.grid_draw_objects[index].my_rect, false);
            }
        }
    }

    /**
     * sets the draw rectangle
     * @param x pos
     * @param y pos
     * @param rect the rect to update
     * @param is_placed
     * @returns {Rect}
     */
    SetDrawRect(x, y, rect, is_placed)
    {
        let temp_spacing_x = this.tile_spacing;
        let temp_spacing_y = this.tile_spacing;
        if(is_placed) {temp_spacing_y *=-1; temp_spacing_x *= -1;}

        rect.x  = (x*this.x_size)+(temp_spacing_x/2);
        rect.y = (y*this.y_size)+(temp_spacing_y/2);
        rect.w  = this.x_size-temp_spacing_x;
        rect.h = this.y_size-temp_spacing_y;

        return new Rect(rect.x, rect.y, rect.h, rect.w);
    }

    /**
     * Check to see if the cursor is in the grid, if so set relevant vars
     * @constructor
     */
    CheckForFocus()
    {
        let rect = Canvas.GetCanvasRect();
        if(rect.isInMe(Input.mouseAbsolutePos))
        {

            let canvas_rect  = rect;
            let x_size =  canvas_rect.w/this.width;
            let y_size =  canvas_rect.h/this.height;

            var relative_pos = Vector2.Subtract(Input.mouseAbsolutePos , new Vector2(rect.x, rect.y));
            var x_pos = Math.floor(relative_pos.x/x_size);
            var y_pos = Math.floor(relative_pos.y/y_size);

            this.focus_pos = new Vector2(x_pos, y_pos);

            this.is_focus = true;
        }
        else
        {
            this.is_focus = false;
        }
    }

    /**
     * Draws the path
     */
    DrawPath()
    {
        //Make sure there is a path and the length of the pass is greater than 1
        if(this.path && this.path.length > 0)
        {
            let size = new Vector2(this.x_size, this.y_size);
            let node = this.path[0];
            while(node.came_from)
            {
                node.DrawLine(size, this.path_col );
                node = node.came_from;
            }
        }
    }

    /**
     * When the AI predictor wants to fill a room this function will be called
     * @param x  pos of the fill
     * @param y  pos of the fill
     * @param r_id  the ID of the room to fill
     * @constructor
     */
    TryApplyAIRoomFill(x,y, r_id)
    {

        //Only spawn a room prediction if a room was placed, we can AI and the room can be sampled
        if(!GVars.AI().Predictor().GetCanSampleRoom(r_id)) return;

        //FIll the room, so as to give the user the option to undo the random prop placements
        GVars.Memento().MapChanged(this.grid);

        //Get all tiles belonging to this room
        let tiles = this.grid.GetTilesInRoom(x,y);


        //Sample the number of props required to fill room.
        let props = GVars.AI().Predictor().SampleAllRoom(r_id,tiles[0].r_ticket);

        //Loop through the tiles adding the props
        let counter =0;
        let props_per_tile = props.length/tiles.length;
        for(let i = 0; i < tiles.length; i++)
        {
            for (let j = 0; j < props_per_tile; j++)
            {
                //Only add props if they're not blank
                if(parseInt(props[counter]) !== P_CLEAR_ID)
                {
                    tiles[i].AddProp(props[counter], true);
                    GVars.Stats().MapStats().m_NumAIPlacedProps++;
                }
                counter++;
            }

        }
    }

    /**
     * This function should be called every frame to check for user inputs
     * @constructor
     */
    UpdateControls()
    {

        let place_room  = false;

        if(Input.IsMousePressed())
        {
            place_room = true;

            //The user has clicked so update statistics
            GVars.Stats().MapStats().m_NumClicks++;
        }

        //Check that the level editor is in focus for this click
        if(!this.is_focus)
        {
            this.is_interacting = false;
            return;
        }


        //Try and get the current type we're placing
        let response = GVars.ObjectManager().GetObject(this.object_ID);

        if(Input.IsMouseHeld() && (response.type === R_TYPE && response.value.canDrag))
        {
            place_room = true;
        }

        if(place_room)
        {

                //set x y position to the focus positions of the mouse
                let x = this.focus_pos.x;
                let y = this.focus_pos.y;

                let placed = false;

                switch (response.type)
                {
                    case R_TYPE:
                    {
                        //Place the room
                        placed = this.grid.TryPlaceRoom(x,y,response.value, response.value.overwrite);

                        if(placed)
                        {
                            this.TryApplyAIRoomFill(x,y, this.object_ID);
                        }
                        break;
                    }
                    case P_TYPE:
                    {

                        //Check to see if the prop is the clear prop
                        if(this.object_ID === P_CLEAR_ID)
                        {
                            placed = this.grid.TryRemoveProp(x,y);

                            //Only remove a prop from the room models if we're AIing
                            if(placed && GVars.Stats().Settings().canAI)
                            {
                                GVars.AI().Predictor().PropUpdated(this.grid.GetRoomAtPos(x,y), placed, this.grid.tiles[y][x].r_ticket, -1);
                            }
                            break;
                        }

                        //Place the prop
                        placed = this.grid.TryPlaceProp(x,y, response.value);

                        //Only add to the room models if we're currently AIing
                        if(placed  && GVars.Stats().Settings().canAI)
                        {
                            GVars.AI().Predictor().PropUpdated(this.grid.GetRoomAtPos(x,y),this.object_ID, this.grid.tiles[y][x].r_ticket, 1);
                        }
                        break;
                    }
                    case "NONE":
                    {

                        console.log("The current type cannot be found :s");
                    }
                }

                //check to make sure the map was actually changed
                if(placed) this.LevelChanged();

                this.is_interacting = true;
        }
        else
        {
            this.is_interacting = false;
        }

    }


    /**
     * Sets the path for the level viewer to draw, Also handles switching the colours
     * @param valid   if the path was valid or not
     * @param path    the path struct
     * @constructor
     */
    SetPath(valid, path)
    {
        //Change path colour
        if(valid) this.path_col = S_VALID_PATH;
        else      this.path_col = S_BAD_PATH;

        //Set path
        if(path && path.length>0) this.path = path;
    }

    /**
     *Makes a path from either the start or the closest point to end tile
     * @param from_start if the path to draw is from the start or from the end tile
     */
    MakePath(from_start)
    {
        //If there is a path use it
        if(this.path && this.path.length > 0)
        {
            this.grid.MakeStartEndPath(this.path[0], from_start);
        }
        else
        {
            this.grid.MakeStartEndPath();
        }
    }

    /**
     * Undos the last placement
     * @returns {boolean} true if the undo was successful
     */
    UndoPlacement()
    {
        this.LevelChanged();

        return GVars.Memento().Undo(this.grid, GVars.AI().Predictor());
    }

    /**
     * Whenever something changes the level call this function
     */
    LevelChanged()
    {
        //disables the level complete
        GVars.LevelComplete().className = "levelComplete disable";

        //The path needs to be recalculated
        this.path = undefined;


    }

    /**
     * Redos the last undo
     * @returns {boolean} true if the redo was successful
     */
    RedoPlacement()
    {
        this.LevelChanged();

        return GVars.Memento().Redo(this.grid, GVars.AI().Predictor());
    }

    /**
     * Clears the level data and resets everything
     * @constructor
     */
    Clear()
    {
        this.grid.InitEmptyGrid();
        this.g_props = [];
        this.LevelChanged();
    }


    Grid(){return this.grid;}
}