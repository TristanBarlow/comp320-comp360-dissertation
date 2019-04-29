const TUTORIAL_FIRST =
    {
      message:`In this experiment you will be required to make FIVE levels for a DUNGEON CRAWLER. TWO of the FIVE levels have minimum size restrictions. Some buttons are only available with the AI.`,
      gif: false,
    };
const TUTORIAL_START_END =
    {
        message:`All levels require a START and an END tile. There needs to be a path between them`,
        gif: `Images/Tutorial/START_END.gif`,
    };
const TUTORIAL_PATH_WALL =
    {
        message:`WALLS and PATHS are draggable and WALLS delete.`,
        gif: `Images/Tutorial/PATH_WALL.gif`,
    };
const TUTORIAL_PLAY =
    {
        message:`The PLAY button allows you to play test your level. WASD or Arrow Keys to move. Q or ESCAPE to quit.`,
        gif: `Images/Tutorial/PLAY.gif`,
    };
const TUTORIAL_ATTACK =
    {
        message:`Move to a tile to ATTACK Occupants. WIN by getting to the END tile. Health is shown by the opacity.`,
        gif: `Images/Tutorial/ATTACK.gif`,
    };
const TUTORIAL_ROOM_PROP =
    {
        message:`Rooms can be selected on the left and placed on the map. Props can only be placed in the rooms.`,
        gif: `Images/Tutorial/ROOM_AND_PROP.gif`,
    };
const TUTORIAL_GHOSTLY =
    {
        message:`The AI will learn your intentions for a room and produce GHOSTLY PROPS. Rooms that are being used in the AIs memory have a white border. Ghostly props will ONLY appear in EMPTY rooms.`,
        gif: `Images/Tutorial/GHOSTLY_PROPS.gif`,
    };
const TUTORIAL_AI_REFRESH =
    {
        message:`Ghostly props can be recalculated with the PROP REFRESH Button.`,
        gif: `Images/Tutorial/REFRESH_AI.gif`,
    };
const TUTORIAL_PROP_FILL =
    {
        message:`The PROP FILL button turns the ghostly props into REAL props`,
        gif: `Images/Tutorial/PROP_FILL.gif`,
    };
const TUTORIAL_MAKE_PATHS =
    {
        message:`The MAKE PATHS button can place a start and an end tile and make paths to all of the rooms.`,
        gif: `Images/Tutorial/MAKE_PATHS.gif`,
    };
const TUTORIAL_END =
{
    message:`Remember THERE ARE FIVE levels to create once you are happy with the current level click LEVEL COMPLETE!`,
    gif: `Images/Tutorial/LEVEL_COMPLETE.gif`,
};

const TUTORIAL_ARR = [TUTORIAL_FIRST, TUTORIAL_START_END,TUTORIAL_ROOM_PROP, TUTORIAL_PATH_WALL, TUTORIAL_PLAY, TUTORIAL_ATTACK,TUTORIAL_GHOSTLY, TUTORIAL_PROP_FILL, TUTORIAL_AI_REFRESH, TUTORIAL_MAKE_PATHS, TUTORIAL_END];