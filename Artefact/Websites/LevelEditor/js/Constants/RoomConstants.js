const R_WALL_ID     = -1;
const R_START_ID    = -11;
const R_END_ID      = -10;
const R_PATH_ID     = -2;
const R_RESERVED_ID =  1;
const R_TYPE = "ROOM";
const B_TOP = 0;
const B_BOTTOM = 1;
const B_LEFT = 2;
const B_RIGHT = 3;

const R_WALL =
    {
        name    : "Wall",
        ID      : R_WALL_ID,
        size    : 1,
        colour  : "#ad8390",

        canProp  : false,
        isPath   : false,
        canPlace : true,
        isUnique : false,
        canDrag  : true,
        overwrite: true,
    };

const R_START=
    {
        name    : "Start",
        ID      : R_START_ID,
        size    : 1,
        colour  : "#83dde8",

        canProp : false,
        isPath  : true,
        canPlace : true,
        isUnique : true,
        canDrag  : false,
        overwrite: true,
    };

const R_END =
    {
        name    : "End",
        ID      : R_END_ID,
        size    : 1,
        colour  : "#e8e293",

        canProp : false,
        isPath  : true,
        canPlace : true,
        isUnique : true,
        canDrag  : false,
        overwrite: true,
    };

const R_PATH =
    {
        name     : "Path",
        ID       : R_PATH_ID,
        size     : 1,
        colour   : "#8bffbb",

        canProp  : false,
        isPath   : true,
        canPlace : true,
        isUnique : false,
        canDrag  : true,
        overwrite: false,
    };

const R_RESERVED =
    {
        name     : "Reserved",
        ID       : R_RESERVED_ID,
        size     : 1,
        colour   : "#f5faff",

        canProp  : true,
        isPath   : true,
        canPlace : false,
        isUnique : false,
        canDrag  : false,
        overwrite: true,
    };

const R_CUBICAL =
    {
        name     : "2x2",
        ID       : 4,
        size     : 2,
        colour   : "#cab0ff",

        canProp  : true,
        isPath   : true,
        canPlace : true,
        isUnique : false,
        overwrite: true,
    };
const R_LOUNGE =
    {
        name     : "3x3",
        ID       : 5,
        size     : 3,
        colour   : "#e8b890",

        canProp  : true,
        isPath   : true,
        canPlace : true,
        isUnique : false,
        canDrag  : false,
        overwrite: true,
    };
const R_STORAGE =
    {
        name     : "4x4",
        ID       : 6,
        size     : 4,
        colour   : "#b3c3e8",

        canProp  : true,
        isPath   : true,
        canPlace : true,
        isUnique : false,
        canDrag  : false,
        overwrite: true,
    };
const R_KITCHEN =
    {
        name     : "1x1",
        ID       : 7,
        size     : 1,
        colour   : "#e69ae8",

        canProp  : true,
        isPath   : true,
        canPlace : true,
        isUnique : false,
        canDrag  : false,
        overwrite: true,
    };
const ROOMS = [R_END, R_PATH,
    R_RESERVED, R_START,
    R_WALL, R_CUBICAL,
    R_LOUNGE, R_STORAGE, R_KITCHEN];
