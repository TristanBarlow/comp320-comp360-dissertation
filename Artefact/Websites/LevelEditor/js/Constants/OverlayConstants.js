const O_RESET = {
    message : "Are you sure you want to reset the entire map?",
    noFunc  : HtmlBridge.OverlayOff,
    noMsg   : "Cancel",
    yesFunc : HtmlBridge.ClearLevel,
    yesMsg  : "Reset"

};
const O_LEVEL_COMPLETE = {
    message : "Are you sure you want to finish making this level?",
    noFunc  : HtmlBridge.OverlayOff,
    noMsg   : "Cancel",
    yesFunc : HtmlBridge.LevelComplete,
    yesMsg  : "Finished"
};
const O_MAKE_PATH = {
    message : "This level is not completeable would you like me to make a path straight to the end tile?",
    noFunc  : HtmlBridge.OverlayOff,
    noMsg   : "Cancel",
    yesFunc : HtmlBridge.MakePaths,
    yesMsg  : "Yes Please"
};
const O_MAKE_START_END = {
    message : "The level does not contain a start and an end tile. Would you like me to place the missing tiles?",
    noFunc  : HtmlBridge.OverlayOff,
    noMsg   : "Cancel",
    yesFunc : HtmlBridge.RandomlyAddStartEnd,
    yesMsg  : "Yes Please"
};
const O_TUTORIAL = {
    message : "Would you like to do the quick tutorial?",
    noFunc  : HtmlBridge.TutorialEnd,
    noMsg   : "Nah",
    yesFunc : HtmlBridge.TutorialStart,
    yesMsg  : "Yes"
};
const O_END =
    {
        message : "Thank you very much for participating in this experiment!",
    };


