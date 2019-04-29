/**
 * This class contains all of the singletons that this system has
 *  Globals are meant to be "bad" but when they're singletons even systems like UE4 have global class called "G"
 */
class Globals
{
    constructor()
    {

    }

    /**
     * Initialises all of the global variables
     * @constructor
     */
    Init()
    {
        this.my_state_machine = new StateMachine();
        this.overlay_manager_inst = new OverlayManager();
        this.level_viewer = null;
        this.information_log = document.getElementById("informationLog");
        this.level_object_manager = new LevelObjectManager();
        this.level_complete = document.getElementById("complete");
        this.stats_manager = new StatManager();
        this.AI_bridge = new AIBridge();
        this.memento = new Memento();
        this.toolbar_manager = new ToolbarManager();
    }

    /**
     * Gets the tool bar manager singleton
     * @returns {*|ToolbarManager}
     * @constructor
     */
    ToolbarManager(){return this.toolbar_manager;}

    /**
     * Gets level complete button
     * @returns {HTMLElement | *} the html element of the level complete button
     */
    LevelComplete() {return this.level_complete;}

    /**
     * Gets the stats singleton
     * @returns {StatManager}
     */
    Stats()         {return this.stats_manager;}

    /**
     * Gets the object manager singleton
     * @returns {LevelObjectManager}
     */
    ObjectManager()   {return this.level_object_manager;}

    /**
     * Gets the information log element
     * @returns {HTMLElement | *}
     */
    InfoLog()       {return this.information_log;}

    /**
     * Gets the state machine singleton
     * @returns {*|StateMachine}
     * @constructor
     */
    StateMachine()  {return this.my_state_machine;}

    /**
     * Gets the overlay manager singleton
     * @returns {OverlayManager}
     * @constructor
     */
    OverlayMan()    {return this.overlay_manager_inst;}

    /**
     * Gets the AI bridge singleton
     * @returns {AIBridge}
     * @constructor
     */
    AI()            {return this.AI_bridge;}

    /**
     * Gets the memento singleton
     * @returns {*|Memento}
     * @constructor
     */
    Memento()       {return this.memento;}

    /**
     * Gets the GameLevel viewer singleton
     * @returns {LevelViewer}
     * @constructor
     */
    LevelViewer()
    {
        if(this.level_viewer)
        {
            return this.level_viewer;
        }
        console.log("no level viewer");
        return false;
    }
}
