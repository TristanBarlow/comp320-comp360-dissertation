/**
 * This class handles everything to do with the overlays
 */
class OverlayManager
{
    constructor()
    {
        this.overlay = document.getElementById("overlay");
        this.overlayRes = document.getElementById("OverlayResponses");
        this.overlay_input = document.getElementById("overlay_input");
        this.overlayMessgae = document.getElementById("OverlayMessage");
        this.overlay_img = document.getElementById('overlayImage');
        this.on = false;
    }

    /**
     * Turns the overlay one
     * @param values  the room_entries to send to the html elements
     */
    OverlayOn(values)
    {

        this.Clear();

        HtmlBridge.AttachHtmlButton(this.overlayRes, "overlayButton", OverlayManager.GetButtonClickFunction(values.yesFunc), values.yesMsg, '#5ae8ae');
        HtmlBridge.AttachHtmlButton(this.overlayRes, "overlayButton", OverlayManager.GetButtonClickFunction(values.noFunc), values.noMsg, '#e8bdc7');

        //Make visible set message
        this.OverlayDisplay(values.message);

    }

    /**
     * This turns the overlay on but in the tip format.
     * @param settings  the tip settings to send to the html elements
     */
    TipOn(settings)
    {
        this.Clear();

        HtmlBridge.AttachHtmlButton(this.overlayRes, "overlayButton", OverlayManager.GetButtonClickFunction(HtmlBridge.TipContinue), "Continue",'#5ae8ae');

        this.OverlayDisplay(settings.Tip);
    }

    /**
     * SetsUp the tutorial
     */
    TutorialON(tutorial)
    {
        this.Clear();

        if(tutorial.gif)
        this.ActivateImg(tutorial.gif);

        HtmlBridge.AttachHtmlButton(this.overlayRes, "overlayButton", OverlayManager.GetButtonClickFunction(HtmlBridge.TutorialNext), "Next",'#5ae8ae');

        this.OverlayDisplay(tutorial.message);
    }

    /**
     * Activates the image and sets up the newt styling
     * @param nSrc
     * @constructor
     */
    ActivateImg(nSrc)
    {
        this.overlay_img.src = nSrc;
        this.overlay_img.style.visibility = 'visible';
        this.overlay_img.style.position = 'relative';
    }

    /**
     * Turns off the image making it hidden and not in the way
     * @constructor
     */
    TurnOffImage()
    {
        this.overlay_img.style.visibility = 'hidden';
        this.overlay_img.style.position = 'fixed';
    }

    /**
     * This turns the overlay on but in the tip format.
     * @param did_win
     * @param time
     * @param score
     * @param health
     */
    GameCompleteMessage(did_win, time, score, health)
    {
        this.Clear();

        HtmlBridge.AttachHtmlButton(this.overlayRes, "overlayButton", OverlayManager.GetButtonClickFunction(HtmlBridge.LevelPlayFinished), "Continue",'#5ae8ae');

        if(did_win)GVars.Stats().MapStats().m_Wins++;

        let str = "";
        if(did_win) str += "You WON";
        else str += "You LOST";

        str += "<br>You played the level for " + Math.floor(time) + "s<br>";

        str += "You scored: "  + score + " <br>";
        str += "You had "  + Math.floor(health) + "% of your health left";
        this.OverlayDisplay(str);
    }

    /**
     * Switches the overlay on with the end settings
     */
    EndOn()
    {
        this.Clear();

        //HtmlBridge.AttachHtmlButton(this.overlayRes, "overlayButton", OverlayManager.GetButtonClickFunction(HtmlBridge.GoToResults), "Continue",'#5ae8ae');

        this.OverlayDisplay(O_END.message);
    }

    /**
     * Switches on the overlay, and changes the state machine
     * @param msg  the title message on the overlay
     */
    OverlayDisplay(msg)
    {
        //Set the message
        this.overlayMessgae.innerHTML = msg;

        if(this.overlay.style.display === "block")return;

        //Make the overlay visible
        this.overlay.style.display = "block";

        //CHange state of machine
        GVars.StateMachine().ChangeState(new OverlayState(STATE_OVERLAY, 0));
    }

    /**
     *Clears the overlay
     */
    Clear()
    {
        this.overlayRes.innerHTML = "";
        this.overlay_input.innerHTML = "";
        this.TurnOffImage();

    }

    /**
     * Turns on the overlay with the question settings
     * @param question the data to fill the question in
     */
    QuestionOn(question)
    {
        this.Clear();

        switch (question.Type)
        {
            case q_TEXT:
            {
                //If its a text question (input)
                HtmlBridge.AttachTextInput(this.overlay_input, q_Code.htmlID);
                HtmlBridge.AttachHtmlButton(this.overlayRes,"overlayButton",OverlayManager.GetTEXTDelegate(question.ID),"Enter", '#62ffb7');
                break;
            }
            case q_MULTI:
            {
                //If its a multi choice question
                for(let i = 0; i < question.responses.length;i++)
                {
                    HtmlBridge.AttachHtmlButton(this.overlayRes,"questionButton",OverlayManager.GetQuestionDelegate(question.ID, i),question.responses[i],'#8d8d8e');

                }
                break;
            }
        }

        this.OverlayDisplay(question.question);
    }

    /**
     * Returns the question response delegate
     * @param ID  the ID of the question
     * @param index the index of the question response
     * @return {function(): boolean} return false to stop the href being called
     * @constructor
     */
    static GetQuestionDelegate(ID, index)
    {
        return function ()
        {
            HtmlBridge.QuestionResponse(ID, index);
            return false;
        };
    }

    /**
     * Get Returns text reponse delegate
     * @param ID of the question
     * @return {function(): boolean} return false to stop the href being called
     * @constructor
     */
    static GetTEXTDelegate(ID)
    {
        return function ()
        {
            HtmlBridge.QuestionResponse(ID,0, q_TEXT);
            return false;
        };
    }

    /**
     * Makes a delegate with that returns false to stop the href doing annoying stuff
     * @param delegate
     * @return {function(): boolean}
     */
    static GetButtonClickFunction(delegate)
    {
        return function () {
            delegate();
            return false;
        };
    }

    /**
     *  Turns the overlay off
     */
    OverlayOff()
    {
        this.overlay.style.display = "none";
        this.TurnOffImage();
        GVars.StateMachine().ChangeToLastState();
        this.on = false;
    }

}
