
const P_Y_RATIO = 0.8;
const P_TYPE = "PROP";
const P_CLEAR_ID = 99;
const P_COLLECT_ID = 98;

const LIGHT_HEALTH = 1.0;
const LIGHT_DMG    = 0.2;
const LIGHT_TICK_RT = 1;

const HEAVY_HEALTH = 2.0;
const HEAVY_DMG    = 0.3;
const HEAVY_TICK_RT = 2;

const PLAYER_DAMAGE = 0.5;
const PLAYER_HEALTH = 2.0;

const WEAPON_CHEST_BUFF = 0.2;

const STAMINA_BUFF = 0.1;

const P_LIGHT_ENEMY=
    {
        name        : "Light Enemy",
        description : "This is a light enemy, they move fast but they have little health",
        ID          : 100,
        sprite      : new Image(),
        sprite_name : "lightBady.png",
        game_entity : new GameEntity(100, TYPE_ENEMY, LIGHT_HEALTH, 10,LIGHT_DMG,LIGHT_TICK_RT),
        game_sprite : new Image(),
        can_place   : true
    };
const P_HEAVY_ENEMY=
    {
        name        : "Heavy Enemy",
        description : "This is a Heavy enemy, they move slow but they have lots of health",
        ID          : 101,
        sprite      : new Image(),
        sprite_name : "HeavyBady.png",
        game_entity : new GameEntity(101, TYPE_ENEMY, HEAVY_HEALTH, 50,HEAVY_DMG, HEAVY_TICK_RT),
        game_sprite : new Image(),
        can_place   : true
    };
const P_CURRENCY_CHEST=
    {
        name        : "Currency Chest",
        description : "When this chest is opened it will give the player some currency",
        ID          : 102,
        sprite      : new Image(),
        sprite_name : "CoinsChest.png",
        game_entity : new GameEntity(102, TYPE_LOOT, 1.0,400, 0,0),
        game_sprite : new Image(),
        can_place   : true
    };
const P_WEAPON_CHEST=
    {
        name        : "Weapon Cache",
        description : "When this chest is opened it will give the player a random weapon.",
        ID          : 103,
        sprite      : new Image(),
        sprite_name : "weapons.png",
        game_entity : new GameEntity(103, TYPE_ATT_MOD, 1.0, 200,WEAPON_CHEST_BUFF,0),
        game_sprite : new Image(),
        can_place   : true
    };
const P_HEALTH_PICKUP=
    {
        name        : "Health Pickup",
        description : "When picked up, this prop will restore the player to full health",
        ID          : 104,
        sprite      : new Image(),
        sprite_name : "Health.png",
        game_entity : new GameEntity(104, TYPE_PICKUP, 1.0, 40,0,0),
        game_sprite : new Image(),
        can_place   : true
    };
const P_STAMINA_PICKUP=
    {
        name        : "Stamina Pickup",
        description : "When picked up, this prop will restore the players' stamina to full.",
        ID          : 105,
        sprite      : new Image(),
        sprite_name : "Stamina.png",
        game_entity : new GameEntity(105, TYPE_ATT_MOD, 1.0, 10,STAMINA_BUFF, 0),
        game_sprite : new Image(),
        can_place   : true
    };
const P_PLAYER =
    {
        name        : "Player Character",
        description : "This prop represents the player character",
        ID          : 106,
        sprite      : new Image(),
        sprite_name : "Player.png",
        game_entity : new GameEntity(106, TYPE_PLAYER, PLAYER_HEALTH,0,PLAYER_DAMAGE, 0),
        game_sprite : new Image(),
        can_place   : false,
    };
const P_CLEAR=
    {
        name        : "Prop Remove",
        description : "This will remove a prop from a given square",
        ID          : P_CLEAR_ID,
        sprite      : new Image(),
        sprite_name : 'removed.png',
        can_place   : true,
    };
const P_COLLECT=
    {
        name        : "Prop Remove",
        description : "This prop is used to represent when something has been collected",
        ID          : P_COLLECT_ID,
        sprite      : new Image(),
        sprite_name : 'tick.png',
        can_place   : false,
    };
const PROPS = [P_CURRENCY_CHEST, P_HEALTH_PICKUP,P_PLAYER,P_COLLECT,
    P_WEAPON_CHEST, P_LIGHT_ENEMY,
    P_HEAVY_ENEMY, P_STAMINA_PICKUP, P_CLEAR];
