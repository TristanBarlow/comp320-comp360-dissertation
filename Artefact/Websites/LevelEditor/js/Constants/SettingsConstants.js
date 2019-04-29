const S_MIN_PROPS = 10;
const S_MIN_TILES = 30;
const S_SPEED_MSG =
    "To complete this level you must place at least " + S_MIN_PROPS + " props and at least " + S_MIN_TILES +
    " tiles must be active.";
const S_NO_SPEED     = "There is no minimum size";
const S_ACTIVE_MSG   = "During the creation of this level there WILL BE an AI assistant to help in the level design.";
const S_INACTIVE_MSG = "During the creation of this level there WILL NOT be any assistance from the AI.";
const S_CREATIV_MSG  = "During the creation of this level the AI tool will make novel suggestions.";
const S_MAX_HISTORY  = 30;


const S_GHOSTLY_OP   = 0.3;
const S_GHOST        = true;

const PROPS_PER_TILE = 2;

const S_RANDOM_ORDER = true;
const S_BAD_PATH   = '#ff1524';

const S_WIDTH      = 20;
const S_HEIGHT     = 15;


const S_VALID_PATH   = '#000000';
const S_BORDER_COL   = '#fefff6';
const S_BORDER_THICK   = 4;

const A_MIN_RATIO    = 0;
const A_ENTER        = 0.1;
const A_LEAVE        = 0.1;

const s_Size_MI =
    {
        ID       : "p_Size_MI",
        Tip      : S_ACTIVE_MSG + S_NO_SPEED,
        minProps : 0,
        minTiles : 0,
        canAI    : true,
        isNovel  : false
    };
const s_Size_No_MI =
    {
        ID       : "p_Size_No_MI",
        Tip      : S_INACTIVE_MSG + S_NO_SPEED,
        minProps : 0,
        minTiles : 0,
        canAI    : false,
        isNovel  : false
    };
const s_Speed =
    {
        ID       : "p_Speed_MI",
        Tip      : S_ACTIVE_MSG + S_SPEED_MSG,
        minProps : S_MIN_PROPS,
        minTiles : S_MIN_TILES,
        canAI    : true,
        isNovel  : false,
    };
const s_Speed_No_MI =
    {
        ID       : "p_Speed_No_MI",
        Tip      : S_INACTIVE_MSG + S_SPEED_MSG,
        minProps : S_MIN_PROPS,
        minTiles : S_MIN_TILES,
        canAI    : false,
        isNovel  : false
    };
const s_Creative =
    {
        ID       : "p_Creative",
        Tip      : S_CREATIV_MSG + S_NO_SPEED,
        minProps : 0,
        minTiles : 0,
        canAI    : true,
        isNovel  : true,
    };

const SETTINGS_DICT =
    {
        p_Size_MI     : s_Size_MI,
        p_Size_No_MI  : s_Size_No_MI,
        p_Speed_MI    : s_Speed,
        p_Speed_No_MI : s_Speed_No_MI,
        p_Creative    : s_Creative,

    };