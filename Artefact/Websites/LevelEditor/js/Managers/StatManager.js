/**
 * This class handles all of the stats data, inputting data etc.
 */
class StatManager
{
    constructor()
    {
        this.uid = StatisticStructs.NewUUID();
        this.stats = StatisticStructs.GetNewParticipantStruct(this.uid);

        this.map_list      = Object.keys(this.stats.p_Maps);
        if(S_RANDOM_ORDER) this.map_list = shuffle(this.map_list);

        this.m_start_time = 0;
        this.p_start_time = 0;
        this.counter = 0;

        this.current_map = undefined;

        this.is_start = true;

        this.q_index   = 0;
        this.questions = Q_START_QUESTIONS;

        this.tutorial_index = 0;
    }


    NextTutorial()
    {
        if(this.tutorial_index >= TUTORIAL_ARR.length)
        {
            HtmlBridge.TutorialEnd();
            return;
        }
        GVars.OverlayMan().TutorialON(TUTORIAL_ARR[this.tutorial_index]);
        this.tutorial_index++;
    }

    /**
     * Function to be called when the game ends
     */
    EndOfExperiment()
    {

        //Send the data to the server
        PostHandler.SendPostMessage("R", this.stats.p_Questionaire.q_Code, this.stats,undefined );

        //turn off overlay
        GVars.OverlayMan().EndOn();
    }

    /**
     *Function to be called when the map is finished and a new map is needed
     */
    NewMap()
    {
        //This is for startup questionnaire to stop it iterating to the next map
        if(this.is_start)
        {
            this.is_start = false;
            this.questions = Q_MAP_QUESTIONS;
            this.p_start_time = StatManager.GetTime();
        }

        //Check to see if we have finished the experiment
        if(this.map_list.length <1)
        {
            this.EndOfExperiment();
            return;
        }


        //Get next map setting
        this.current_map = this.map_list.pop();

        //Add the new AI buttons
        if(this.Settings().canAI)
        {
            GVars.ToolbarManager().AddButtonsToHeader(TOOLBAR_AI_BUTTONS);
        }
        else
        {
            GVars.ToolbarManager().RemoveButtons(TOOLBAR_AI_BUTTONS);
        }

        //Show this settings tip
        GVars.OverlayMan().TipOn(this.Settings());

        this.MapStats().m_OrderNum = this.counter;
        this.counter++;
    }

    /**
     *Function to be called when a map starts
     */
    StartMap()
    {
        //Record the start time
        this.m_start_time = StatManager.GetTime();
    }

    /**
     *Function to be called at the end of the map, triggers questionnaire and records times
     */
    EndMap()
    {
        this.RecordTime();
        this.StartQuestionnaire();
    }

    RecordTime()
    {
        this.MapStats().m_TimeToComplete = (StatManager.GetTime() - this.m_start_time)/1000;

        this.stats.p_TotalClicks += this.MapStats().m_NumClicks;
        this.stats.p_TotalTime   = (StatManager.GetTime()- this.p_start_time)/1000;
    }

    /**
     * Returns the current time in ms
     * @return {number} the time in ms;
     */
    static GetTime()
    {
        return new Date().getTime();
    }

    /**
     *Starts a new questionnaire
     */
    StartQuestionnaire()
    {
        this.q_index = 0;
        GVars.OverlayMan().QuestionOn(this.GetNextQuestion());
    }

    /**
     * Get the current settings
     * @return {Settings} returns the current settings details
     * @constructor
     */
    Settings()
    {
        return SETTINGS_DICT[this.current_map];
    }

    /**
     * Gets the next question, checking for the end of the questions
     * @return {boolean} return the next question or false if there are no more questions
     */
    GetNextQuestion()
    {
        //if there are still questions left get the next one
        if(this.q_index < this.questions.length)
        {
            return this.questions[this.q_index];
        }

        //If this is not the start questionnaire store the end of game stats in the data structs
        if(!this.is_start)
        {
            StatisticStructs.SetFinalMapStats(GVars.Stats().stats, GVars.Stats().MapStats(), GVars.LevelViewer().Grid(), GVars.AI().Predictor());
            GVars.LevelViewer().Clear();
        }

        //If we are here we know we have finished the questionaire design.
        HtmlBridge.OverlayOff();

        //Get a new map
        this.NewMap();

        return false;
    }

    /**
     * Handle an incoming response to a question
     * @param ID  the ID of the question
     * @param value the incoming response to the asked question
     * @constructor
     */
    QuestionResponse(ID, value)
    {
        this.GetQuestionnaire()[ID] = value;
        this.q_index++;
    }

    /**
     * Gets the current questionnaire
     * @return {Object} questionnaire data
     */
    GetQuestionnaire()
    {
        //If this is the start questionnaire return it
        if(this.is_start)return this.Stats().p_Questionaire;

        //Return the maps
        else return this.MapStats().m_Questionaire;
    }

    /**
     * Gets the stats
     * @return {Stats} gets the entire stat struct
     * @constructor
     */
    Stats(){return this.stats;}

    /**
     * Just gets the stats to this current map
     * @return {*}
     */
    MapStats()
    {
        return this.stats.p_Maps[this.current_map];
    }

}
