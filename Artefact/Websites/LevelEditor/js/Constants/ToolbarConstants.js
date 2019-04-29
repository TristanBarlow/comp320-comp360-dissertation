const T_PLAY_TEST = {
    icon     : undefined,
    name     : "PLAY",
    colour   : '#00d1d7',
    delegate : HtmlBridge.StartPlayTest
};
const T_UNDO = {
    icon     : undefined,
    name     : "Undo",
    colour   : '#af0600',
    delegate :  HtmlBridge.Undo
};
const T_REDO = {
    icon     : undefined,
    name     : "Redo",
    colour   : '#afad00',
    delegate :  HtmlBridge.Redo
};
const T_RESET = {
    icon     : undefined,
    name     : "Reset",
    colour   : '#e8b5c5',
    delegate :  HtmlBridge.Reset
};

const T_MAKE_PATH =
    {
    icon     : undefined,
    name     : "Make Paths",
    colour   : '#62ffb7',
    delegate :  HtmlBridge.MakePaths
};
const T_PROP_Fill =
    {
        icon     : undefined,
        name     : "Prop Fill",
        colour   : '#99b5ff',
        delegate :  HtmlBridge.ApplyGhostProps
    };
const T_REFRESH =
    {
        icon     : undefined,
        name     : "Refresh AI",
        colour   : '#c2cbff',
        delegate :  HtmlBridge.AIRoomSeedRefresh
    };

const TOOLBAR_DEFAULT_BUTTONS = [T_PLAY_TEST, T_UNDO, T_REDO, T_RESET];
const TOOLBAR_AI_BUTTONS = [T_MAKE_PATH, T_PROP_Fill, T_REFRESH];