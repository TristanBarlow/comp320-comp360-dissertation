/**
 * The state to be used when the level is in creation
 */
class LevelCreationState extends AbstractState
{
    constructor(id)
    {
        super(STATE_CREATE, id);
    }

    /**
     * Sets up the state
     * @constructor
     */
    Setup()
    {
        //create the level viewer and set the room_entries in gvars
        this.level_viewer = new LevelViewer(S_WIDTH,S_HEIGHT, 2);
        GVars.level_viewer = this.level_viewer;
        GAZCanvas.keep_aspect = false;



        GVars.OverlayMan().OverlayOn(O_TUTORIAL);

    }

    /**
     * Runs the state
     * @constructor
     */
    Run()
    {
        super.Run();

        //update controls and canvas
        GAZCanvas.update();
        Input.update();

        //Update the level viewer
        this.level_viewer.CheckForFocus();
        this.level_viewer.UpdateControls();

        //draw
        this.level_viewer.DrawGrid();

    }


}