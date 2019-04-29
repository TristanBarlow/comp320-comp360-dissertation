//Dict containing the command scheme for the player controls
const COMMAND_SCEME
    = {

    //up
    w:function (entity, game_level) { game_level.EntityTryMove(entity, new Vector2(0, -1));},
    up:function (entity, game_level) { game_level.EntityTryMove(entity, new Vector2(0, -1));},

    //left
    a:function (entity, game_level) { game_level.EntityTryMove(entity, new Vector2(-1, 0));},
    left:function (entity, game_level) { game_level.EntityTryMove(entity, new Vector2(-1, 0));},

    //down
    s:function (entity, game_level) { game_level.EntityTryMove(entity, new Vector2(0, 1));},
    down:function (entity, game_level) { game_level.EntityTryMove(entity, new Vector2(0, 1));},

    //right
    d:function (entity, game_level) { game_level.EntityTryMove(entity, new Vector2(1, 0));},
    right:function (entity, game_level) { game_level.EntityTryMove(entity, new Vector2(1, 0));},

    //quit
    escape:function (entiry, game_level) {game_level.PlayerQuit();},
    q:function (entiry, game_level)      {game_level.PlayerQuit();},

};

const SLEEP_TIME = 200;
const END_TIME = 2000;
const E_ATT_LINE= '#ff0019';
const P_ATT_LINE= '#2900ff';
const LINE_WIDTH = 2;
const Y_OFFSET = 50;
const TEXT_SIZE = 50;


const UI_HEALTH_LOC = new Vector2(10,40);
const UI_DAMAGE_LOC= new Vector2(400,40);
const UI_SCORE_LOC= new Vector2(800,40);

/**
 * This class handles the running of the game
 */
class GameLevel
{
    constructor(grid)
    {
        this.width = grid.width;
        this.height = grid.height;
        this.tiles = [];
        this.att_lines = [];
        this.tile_spacing = 0.1;
        this.player = new GamePlayer();
        this.should_sleep = false;
        this.goal = new Vector2(0,0);
        this.end_game = false;
        this.has_won = false;

        this.start_time = GetTimeMS();

        //Create the game level from the map the user is currently making
        for(let y = 0; y < grid.tiles.length; y++)
        {
            let row = grid.tiles[y];

            //go through each row
            for(let x = 0; x < row.length; x++)
            {
                let tile = row[x];
                let entities = [];

                //Try Set the end goal
                if(tile.r_id === R_END_ID)this.goal.set(tile.GetVec());

                //loop through all of the tiles props and create the entities
                for(let i =0; i < tile.props.length; i++)
                {
                    //uses the ID of the prop to clone the base game entity
                    let entity = GVars.ObjectManager().GetProp(tile.props[i].p_id).game_entity.clone();

                    //check for player create
                    if(tile.props[i].p_id === P_PLAYER.ID)this.player = entity;

                    entity.pos = new Vector2(x,y);
                    entities.push(entity);
                }

                //Add the game ready tile to the game tiles
                this.tiles.push(new GameTile(row[x].r_id, entities,new Vector2(x,y)));
            }
        }
    }

    /**
     * Draws all of the attack lines made during the last turn
     * @constructor
     */
    Draw_Att_Lines()
    {
        let att_line = this.att_lines.pop();
        let size = new Vector2(this.x_size, this.y_size);

        //cycle through all of the lines until there are none left
        while(att_line)
        {
            let end = PathNode.CenterLine(att_line.end, size);
            let strt = PathNode.CenterLine(att_line.start, size);
            strt = Vector2.Add(strt, new Vector2(0,Y_OFFSET));
            end = Vector2.Add(end, new Vector2(0,Y_OFFSET));

            GAZCanvas.Line(strt,end , att_line.col, LINE_WIDTH );
            att_line = this.att_lines.pop();
        }
    }

    /**
     * Called when the player quits the game
     * @constructor
     */
    PlayerQuit()
    {
        this.end_game = true;
        this.has_won = false;
        this.should_sleep = true;
    }

    /**
     * Ticks all of the occupants of the level
     * @constructor
     */
    TickLevel()
    {
        for(let i =0; i < this.tiles.length; i++)
        {
            this.tiles[i].TickOccupants(this.player, this);
        }
    }

    /**
     * Called every frame to check for inputs
     * @constructor
     */
    Update()
    {
        //Go through the command scheme and check if any of the keys are pressed
        for(let i in COMMAND_SCEME)
        {
            if(!COMMAND_SCEME.hasOwnProperty(i))continue;

            let code = KEY_CODE_DICT[i];
            if(Input.getKeystate(code) && Input.getKeystate(code) === INPUT_PRESSED)
            {
                //Execute the function associated with the key
                COMMAND_SCEME[i](this.player, this);
                this.should_sleep = true;

                //Check to see if the player has wont the game
                if(this.player.pos.x === this.goal.x && this.player.pos.y === this.goal.y)
                {
                    this.end_game = true;
                    this.should_sleep = true;
                    this.has_won = true;
                }

                //tick all of the other objects
                this.TickLevel();
                return;
            }

        }
    }

    /**
     * Adds an attack line to be drawn during the next update
     * @param strt
     * @param end
     * @param was_player
     * @constructor
     */
    AddAttack(strt, end, was_player = false)
    {
        this.att_lines.push({start: strt ,end: end, col: was_player ? P_ATT_LINE: E_ATT_LINE, is_player: was_player});
    }

    /**
     * Checks to see if the game should sleep for a bit, if so it will do.
     * @constructor
     */
    TrySleep()
    {
        if(this.should_sleep)
        {
            //Sleep the thread this freezes the game, but oh well
            sleep(SLEEP_TIME);
            this.should_sleep = false;

            if(this.end_game)
            {
                //if its endgame set up engame stats, and finish the level
                sleep(END_TIME);
                let time = ((GetTimeMS()- this.start_time)/1000);
                let health_per = (this.player.health/this.player.max_health )*100;
                health_per = health_per >100? 100 : health_per< 0 ? 0 : health_per;
                GVars.OverlayMan().GameCompleteMessage(this.has_won, time, this.player.score, health_per);
            }
        }
    }

    /**
     * This function is called from within the enemies when they want to move
     * @param entity   the entity that wants to move
     * @param dir       the direction they want to move in
     * @param entity_index the index of entity
     * @param entity_num
     * @returns {boolean}  returns true if the move was successful
     * @constructor
     */
    EntityTryMove(entity, dir, entity_index, entity_num)
    {

        //Get the destination location
        let x = entity.pos.x + dir.x;
        let y = entity.pos.y + dir.y;

        //Make sure its in bounds
        if(!(x >= 0 && x <this.width && y >= 0 && y < this.height)) return false;

        //Get the tile at that index
        let index = this.GetTileIndex(entity.pos.x + dir.x, entity.pos.y + dir.y);

        //if its the player that is trying to move call interact function
        if(entity === this.player)
        {
            if (this.tiles[index].HasOccupants())
            {
                this.AddAttack(entity.pos, new Vector2(x, y), true);
                this.tiles[index].InteractWithOccupant(entity);
                return true;
            }
        }

        //Else we know its an enemy trying to move
        else
        {
            //Check to see if the tile the enemy was going to move on contains the player
            if(this.tiles[index].pos.Equal(this.player.pos))
            {
                //Add an attack line, that is offset
                let strt_pos = entity_num <= 1 ? entity.pos: entity_index ===0 ? Vector2.Add(new Vector2(-0.25, -0.25),entity.pos) : Vector2.Add(new Vector2(0.25, 0.25),entity.pos);
                this.AddAttack(strt_pos, this.player.pos, false);

                //deal damage and check if the player is dead
                if(this.player.DamageTaken(entity.dmg))
                {
                    this.end_game = true;
                }
                return true;
            }
        }

        //Check to make sure the enemy is trying to move to a walkable tile
        if(this.tiles[index].CanWalk())
        {
            //move the entity
            let old_index = this.GetTileIndex(entity.pos.x, entity.pos.y);
            this.tiles[old_index].RemoveEntity(entity);
            this.tiles[index].AddEntity(entity);
            return true;
        }

    }

    /**
     * Draws the level
     * @constructor
     */
    Draw()
    {
        //Set up the variables
        let canvasRect  = GAZCanvas.canvas_size;
        this.x_size =  canvasRect.w/this.width;
        this.y_size =  (canvasRect.h - Y_OFFSET)/this.height;

        //Draw all of the tiles
        for(let i =0; i < this.tiles.length;i++)
        {
            this.SetRect(this.tiles[i].my_rect, i);
            this.tiles[i].Draw();
        }

        //draw the attack lines
        this.Draw_Att_Lines();

        //draw UI
        GAZCanvas.Text(TEXT_SIZE, 'Health: ' + this.player.GetHealthPercent() + '%',UI_HEALTH_LOC, '#fff');
        GAZCanvas.Text(TEXT_SIZE, 'Attack: ' + this.player.GetDmgPercent() + '%' ,  UI_DAMAGE_LOC, '#fff');
        GAZCanvas.Text(TEXT_SIZE, 'Score: ' + this.player.score ,                   UI_SCORE_LOC, '#fff');
    }

    /**
     * Gets the x,y pos from the tile index
     * @param i  index of tile
     * @returns {Vector2}
     * @constructor
     */
    GetXYFromIndex(i)
    {
        if(!i) return new Vector2(0,0);
        let y = Math.floor(i/this.width);
        let x = i - (y*this.width);
        return new Vector2(x, y);
    }

    /**
     * Gets tile index from the x y pos
     * @param x
     * @param y
     * @returns {*}
     * @constructor
     */
    GetTileIndex(x, y)
    {
        return (y * this.width) + x;
    }

    /**
     * Sets the given sprite rect object to fit in the grid
     * @param rect  rect to out to
     * @param index  the index of the rect
     * @constructor
     */
    SetRect(rect, index)
    {
        let vec = this.GetXYFromIndex(index);
        let temp_spacing_x = this.tile_spacing;
        let temp_spacing_y = this.tile_spacing;
        temp_spacing_y =1.1; temp_spacing_x = 1.1;

        rect.x  = (vec.x*this.x_size)+(temp_spacing_x);
        rect.y = (vec.y*this.y_size)+(temp_spacing_y) + Y_OFFSET;
        rect.w  = this.x_size *1.01;
        rect.h = this.y_size*1.01;
    }
}