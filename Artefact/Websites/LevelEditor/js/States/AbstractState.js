
class AbstractState
{
    constructor(label, id)
    {
        this.label = label;
        this.id = id;
        this.ShouldRun = false;
    }

    /**
     * Function to be called every tick
     * @constructor
     */
    Run()
    {

    }

    /**
     * Function that is called when this state starts up
     */
    Setup()
    {

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
