/**
 * State used when the user is playing
 */
class PlayLevelState extends AbstractState
{
    constructor(grid)
    {
        super(STATE_PLAY);
        this.level = new GameLevel(grid);
    }

    /**
     * Function to be called every tick
     * @constructor
     */
    Run()
    {
        this.level.TrySleep();

        GAZCanvas.update();
        Input.update();

        this.level.Update();
        this.level.Draw();


    }

    /**
     * Function that is called when this state starts up
     */
    Setup()
    {
        GAZCanvas.keep_aspect = false;
        HtmlBridge.ToggleEditorPlayState(true);
    }

    /**
     *Function that is called to close down this state
     */
    CloseState()
    {

    }

    /**
     *Function that is called when the close state is finished
     */
    Finished()
    {

    }

}