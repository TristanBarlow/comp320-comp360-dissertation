const S_Delay         = 0;
const STATE_CREATE = "create";
const STATE_OVERLAY = "overlay";
const STATE_PLAY = "play";

/**
 * Class that handles all of the different states the program has
 */
class StateMachine
{
    constructor(start_state)
    {
        this.current_state = start_state;
        this.last_state = null;
        this.can_run = true;
        this.exit_time = StatManager.GetTime();
        this.level_editor_state = 0;

    }

    Run()
    {
        //A delay between states can be added
        if(this.can_run)
        {
            this.current_state.Run();
        }

        //If not running process delay
        else
        {
            if (((StatManager.GetTime() - this.exit_time) / 1000) > S_Delay)
            {
                this.can_run = true;
            }
        }

    }

    /**
     * Changes the current state to the new state provided
     * @param new_state the state to change to
     * @constructor
     */
    ChangeState(new_state, save_old_state = false)
    {
        //close old state
        if(this.current_state)
        {
            if(this.current_state.label === STATE_CREATE || this.current_state.label === STATE_OVERLAY)
                this.last_state = this.current_state;
            this.current_state.CloseState();

        }

        //Setup delay
        this.exit_time = StatManager.GetTime();
        this.can_run = false;

        //Set new state
        this.current_state = new_state;
        this.current_state.Setup();
    }

    /**
     * Changes the current state to the previous state
     */
    ChangeToLastState()
    {
        if(!this.last_state)console.log("no state found, oh no");
        this.current_state.CloseState();
        this.current_state = this.last_state;

        this.exit_time = StatManager.GetTime();
        this.can_run = false;
    }

    ChangeToLevelEditorState()
    {
        this.ChangeState(this.level_editor_state);
    }
}