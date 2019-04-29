const DEATH_TICKS = 2;

/**
 * The class that is used to represent the tiles of the game
 */
class GameTile extends SpriteDrawObject
{
    constructor(r_id, occupants, pos)
    {
        let room =  GVars.ObjectManager().GetRoom(r_id);
        super(room.colour);
        this.r_id = r_id;
        this.room =room;
        this.occupants = occupants;
        this.pos = pos;
        this.x = pos.x;
        this.y = pos.y;

    }

    /**
     * Gets if this current tile can be walked on
     * @returns {boolean} true if the tile can be walked on
     * @constructor
     */
    CanWalk()
    {
        return (this.occupants.length < PROPS_PER_TILE &&this.room.isPath ) ;
    }

    /**
     * Adds an entity to the tile
     * @param entity the entity to be added
     * @constructor
     */
    AddEntity(entity)
    {
        entity.pos.set(this.pos);
        this.occupants.push(entity);
    }

    /**
     * Removes an entity from the tile
     * @param entity the entity to be removed
     * @constructor
     */
    RemoveEntity(entity)
    {
        for(let i = 0; i < this.occupants.length; i++)
        {
           if(this.occupants[i] === entity)
           {
               this.occupants.splice(i, 1);
               return;
           }
        }
    }

    /**
     * Returns true if the tile has occupants(dead occupants dont count)
     * @returns {boolean} true if there are occupants in the tile
     * @constructor
     */
    HasOccupants()
    {
        if(!this.occupants || this.occupants.length < 1) return false;

        //Make sure none of the occupants are dead
        for(let i = 0; i < this.occupants.length; i++)
        {
            if(!this.occupants[i].dead)return true;
        }
        return false;
    }

    /**
     * Interacts with the occupants of the given tile
     * @param player the player doing the interacting
     * @constructor
     */
    InteractWithOccupant(player)
    {
        if(this.occupants.length >= 1)
        {
            for(let i = this.occupants.length-1; i >=0 ; i--)
            {
                if(this.occupants[i].dead)continue;
                else  this.occupants[i].Interact(player);
                return;
            }
        }
    }

    /**
     * Updates all occupants inside this tile
     * @param player the player reference so the occupants can interact with them
     * @param level the level
     * @constructor
     */
    TickOccupants(player, level)
    {
        for(let i =0; i < this.occupants.length; i++)
        {
            this.occupants[i].tile_index  =i;

            //if the current occupant is dead tick
            if(this.occupants[i].dead)
            {
                this.occupants[i].dead_ticks++;

                //if the occupant is dead dead remove
                if(this.occupants[i].dead_ticks >= DEATH_TICKS) this.occupants.splice(i, 1);
            }
            else
            {
                this.occupants[i].TickEntity(player, level, i , this.occupants.length);
            }
        }
    }

    /**
     * Draws tile
     * @constructor
     */
    Draw()
    {
        this.props = this.occupants;
        super.Draw(true);
    }
}