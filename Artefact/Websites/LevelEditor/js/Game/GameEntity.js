const TYPE_LOOT = "loot";
const TYPE_ENEMY = "enemy";
const TYPE_PICKUP = "pickup";
const TYPE_PLAYER = "player";
const TYPE_ATT_MOD = 'attack_modifier';
const AGRO_RANGE = 8;
const MIN_OPACITY = 0.15;

/**
 * This is the base class for all game entities in the game
 */
class GameEntity
{
    constructor(p_id, type,health, score, dmg, max_cool_down, pos)
    {
        this.p_id = p_id;
        this.type = type;
        this.max_health = health;
        this.health = health;
        this.dmg    = dmg;
        this.strt_dmg = dmg;
        this.score = score;
        this.pos =pos;
        this.dead_ticks = 0;
        this.dead = false;
        this.max_cool_down = max_cool_down;
        this.cool_down_ticks = max_cool_down;

    }


    /**
    * Deals damage to the entity
    * @param dmg  damage given to this entity
    * @returns {boolean} if true the entity is dead
    * @constructor
    */
    DamageTaken(dmg)
    {
        this.health -= dmg;

        //Check to see if its dead
        if(this.health <= 0)
        {
            //If dead change prop icon and set dead
            this.p_id = P_CLEAR_ID;
            this.dead = true;
        }

        return this.health <= 0;
    }

    /**
     * Get the dmge as a percentage as percentage
     * @returns {number}
     * @constructor
     */
    GetDmgPercent()
    {
        return Math.floor((this.dmg/this.strt_dmg) * 100);
    }

    /**
     * Updates the enemy
     * @param player
     * @param level
     * @param entity_index
     * @param entity_num
     * @constructor
     */
    TickEntity(player, level, entity_index, entity_num)
    {
        if(!this.CanTick()) return;
        switch (this.type)
        {
            case TYPE_PICKUP:
            {
                break;
            }
            case TYPE_LOOT:
            {
                break;
            }
            case TYPE_ENEMY:
            {

                //if its an enemy type then see if we can move towards the player
                let dist = Vector2.Subtract(player.pos, this.pos).length();

                //If the player is in range ATTACK
                if(dist <= AGRO_RANGE)
                {
                    let response = GVars.AI().GetGamePathFinding(level.tiles,  player.pos, this.pos);

                    //If the there is a path, then move the enemy towards the player
                    if(response.valid && response.path)
                    {
                        level.EntityTryMove(this, Vector2.Subtract(response.path[1].pos, this.pos), entity_index, entity_num);
                    }
                }

                break;
            }
        }
    }

    /**
     * Gets the health as a decimal of the max health (used for opacity)
     * @returns {number} the value of the health
     * @constructor
     */
    GetHealthDecimal()
    {
        return  this.health <= MIN_OPACITY ? MIN_OPACITY :  this.health/this.max_health;
    }

    /**
     * Gets the health as  percentage of the max health
     * @returns {number}
     * @constructor
     */
    GetHealthPercent()
    {
        return Math.floor((this.health /this.max_health)*100);
    }

    /**
     * Clones this game entity
     * @returns {GameEntity}
     */
    clone()
    {
        return new GameEntity(this.p_id, this.type, this.health, this.score,this.dmg, this.max_cool_down,this.pos);
    }

    /**
     * Returns true if the entity can update
     * @returns {boolean}
     * @constructor
     */
    CanTick()
    {
        //Make sure the entity is not on a cool down
        if(this.cool_down_ticks <= 0)
        {
            this.cool_down_ticks = this.max_cool_down;
            return true;
        }
        this.cool_down_ticks--;
        return false;
    }

    /**
    * This funcition is called when the player interacts with the entity
    * @param player
    * @constructor
    */
    Interact(player)
    {
        switch (this.type)
        {
            case TYPE_PICKUP:
            {
                //If type pickup, kill the pickup and get more health!
                player.health = player.health >= player.max_health ? player.max_health :  player.health + this.health;
                this.DamageTaken(this.health);
                this.p_id = P_COLLECT_ID;
                player.score += this.score;
                break;
            }
            case TYPE_LOOT:
            {
                //If its loot then kill and increase score!
                player.score += this.score;
                this.DamageTaken(this.health);
                this.p_id = P_COLLECT_ID;
                break;
            }
            case TYPE_ATT_MOD:
            {
                //If its an attack modifier increase the players attack
                player.dmg += this.dmg;
                this.DamageTaken(this.health);
                this.p_id = P_COLLECT_ID;
                break;
            }
            case TYPE_ENEMY:
            {
                //If its an enemy deal damage
                if(this.DamageTaken(player.dmg))
                {
                    this.p_id = P_CLEAR_ID;
                    player.score += this.score;
                }
                break;
            }
        }
    }

}