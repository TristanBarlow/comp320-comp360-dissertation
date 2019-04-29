/**
 * Class that handles the bridge between html elements and the main javascript program
 */
class HtmlBridge
{

    /**
     * Calls the grid data undo functions
     * @return {boolean} returns true if the undo was successful
     */
    static Undo()
    {
        if(GVars.LevelViewer().UndoPlacement())
        {
            HtmlBridge.AddNewLineToLog("Undo");
            GVars.Stats().MapStats().m_NumUndos++;
            return true;
        }
        HtmlBridge.AddNewLineToLog("Failed to Undo");
        return false;

    }

    /**
     *  Calls the grid data functions for redo
     * @return {boolean} returns true if the redo was successful
     */
    static Redo()
    {
        if(GVars.LevelViewer().RedoPlacement())
        {
            HtmlBridge.AddNewLineToLog("Redo");
            GVars.Stats().MapStats().m_NumRedos++;
            return true;
        }
        HtmlBridge.AddNewLineToLog("Failed to Redo");
        return false;

    }

    /**
     *Calls the functions needed to query a reset
     */
    static Reset()
    {
        GVars.OverlayMan().OverlayOn(O_RESET);
    }

    /**
     *Hides the overlay
     */
    static OverlayOff()
    {
        GVars.OverlayMan().OverlayOff();
    }


    /**
     * Changes the object to be placed in the level editor
     * @param id new ID of the object to be placed
     */
    static ChangeObject(id)
    {
        GVars.LevelViewer().object_ID = id;
    }

    /**
     * This function will create buttons for each of the rooms provided
     * @param rooms list of rooms to generate buttons for
     */
    static GenerateRoomButtons(rooms)
    {
        let div = document.getElementById("roomControls");

        for(let key in rooms)
        {
            if(rooms.hasOwnProperty(key))
            {
                let room = rooms[key];

                //If the room cannot be place skip
                if(!room.canPlace)continue;

                //Create the function that will be used when the button is clicked
                let onclick = function ()
                {
                    HtmlBridge.ChangeObject(room.ID);
                };

                //Make the button and append it
                let b = HtmlBridge.AttachHtmlButton(div, "RoomButton", onclick, room.name, room.colour);
            }
        }
    }

    /**
     * Generates prop buttons for each of the props provided
     * @param props  list of props to be added
     * @constructor
     */
    static GeneratePropButtons(props)
    {
        let div = document.getElementById('propControls');

        for(let key in props)
        {
            if(props.hasOwnProperty(key))
            {
                let prop =  props[key];

                if(!prop.can_place )continue;

                let onclick = function ()
                {
                    HtmlBridge.ChangeObject(prop.ID);
                };

                //Make the button and append it
                HtmlBridge.AttachHtmlButton(div, "RoomButton", onclick, prop.name);
            }
        }
    }

    /**
     * This function refreshes all of the seeds in the all of the room models
     * @constructor
     */
    static AIRoomSeedRefresh()
    {
        GVars.AI().Predictor().ResetSeeds();

        GVars.LevelViewer().Grid().GhostlySampleProps(GVars.AI().Predictor().last_predict, 0);

        GVars.Stats().MapStats().m_NumAIRefreshes++;
    }

    /**
     * Connects all of the rooms to the nearest path which connects to the start or the end tile
     * @constructor
     */
    static ConnectRoomsToPath()
    {
        //get grid ref
        let grid = GVars.LevelViewer().Grid();

        //Get a list of all the rooms
        let active_rooms = grid.active_rooms;

        let key_arr = shuffle(Object.keys(grid.active_rooms));

        //get the start and the end tile
        let start_end = grid.GetStartAndEndTile();

        //get The start tile
        let start = start_end.start.GetVec().toString();

        let tile_arr = grid.GetTileArray();

        //if there is no start tile return
        if(!start) return false;

        let should_memento = true;

        //Loop through all of the rooms and create paths
        for(let i = 0; i < key_arr.length;i++)
        {
            //get room entry
            let room = active_rooms[key_arr[i]];

            //Make sure the room is a room with significance
            if( !room || room.roomID === R_PATH_ID || room.roomID === R_START_ID || room.roomID === R_END_ID) continue;

            //Get the middle tile of the room to path find to
            let mid = room.GetMiddleTile().GetVec().toString();

            //Try to path find to the room
            let response = GVars.AI().GetGamePathFinding(tile_arr , start,  mid);

            //If there is a valid room then the room is already connected
            if(response.valid || response.path.length < 1) continue;

            //If we have memenoed do so
            if(should_memento)
            {
                should_memento = false;
                GVars.Memento().MapChanged(grid);
            }

            //Try and make sure not to use the end tile node
            let start_node = response.path[0];
            if(response.path[0].GetID() === start_end.end.GetVec().toString() && response.path.length >1)
            {
                start_node = response.path[1];
            }

            //Find a path to the shortest path to the room
            let new_path = GVars.AI().GetPathBetweenRooms(tile_arr, start_node.GetID(),mid);

            //Apply the path to the grid
            grid.ConstructPath(new_path.path);

        }

    }


    /**
     * This function will make a path from the start to the end and alert the player
     */
    static MakePaths()
    {

        GVars.Stats().MapStats().m_NumAIMakePaths++;

        //Check for required rooms, add them if they're not there
        if(!HtmlBridge.CheckRequiredRooms(true)) HtmlBridge.RandomlyAddStartEnd();

        //Generate a response to path find from
        let response = GVars.AI().TryPathFinder(GVars.LevelViewer().Grid());

        //Give the level viewer the path
        GVars.LevelViewer().SetPath(response.valid, response.path);

        //If there is already a valid path do nothing
        if(response.valid)
        {
            HtmlBridge.ConnectRoomsToPath();

            HtmlBridge.AddNewLineToLog("Im sorry there is already a valid path");
            return;
        }

        //make the path
        GVars.LevelViewer().MakePath(response.from_start);

        //overlay off
        GVars.OverlayMan().OverlayOff();

        HtmlBridge.ConnectRoomsToPath();

        //Mak sure there is a visible path but mute any alerts from the check
        HtmlBridge.Check(true);

        //Inform the player
        HtmlBridge.AddNewLineToLog(" I have added a path straight to the end tile");
    }

    /**
     * This function is to be called when the user agrees to randomly placing start and end tiles
     */
    static RandomlyAddStartEnd()
    {
        //tries Add the start and end
        let r = GVars.LevelViewer().Grid().TryAddStartEnd();
        GVars.OverlayMan().OverlayOff();

        if(r.start && r.end)
        {
            HtmlBridge.AddNewLineToLog("I have randomly placed a start and an end tile");
        }
        else
        {
            HtmlBridge.AddNewLineToLog("I have failed to place a start and an end tile, make sure there is enough room!");
        }
    }

    /**
     * Called when the user clicks the complete level button
     */
    static TryLevelComplete()
    {
        //Make sure the level is completable
        if(HtmlBridge.Check())
        {
            GVars.OverlayMan().OverlayOn(O_LEVEL_COMPLETE);
        }
    }

    /**
     *When the level is actually finished this function will be called
     */
    static LevelComplete()
    {
        GVars.OverlayMan().OverlayOff();


        GVars.Stats().EndMap();
        HtmlBridge.ClearInformationLog();
    }

    static LevelPlayFinished()
    {
        GVars.OverlayMan().OverlayOff();

        HtmlBridge.ToggleEditorPlayState(false);

    }

    /**
     * Checks the grid incase there are any missing tiles that are required. And perform any prompts if none are present
     * @param mute  if true there will be no popups
     * @returns {boolean} true if all the required tiles are present
     * @constructor
     */
    static CheckRequiredRooms(mute = false)
    {
        //Check to make sure there is a start and end pos
        let points = GVars.LevelViewer().Grid().GetStartAndEndTile();
        if(!points.start || !points.end)
        {

            //If the AI is active give them the option to generate a start and an end tile
            if(GVars.Stats().Settings().canAI)
            {
                if(!mute)
                {
                    GVars.OverlayMan().OverlayOn(O_MAKE_START_END);
                }
                return false;
            }

            if(!mute)
            {
                HtmlBridge.AddNewLineToLog("This level is missing a start and an end tile");
            }
            GVars.LevelComplete().className = "levelComplete disable";
            return false;
        }
        return true;
    }

    /**
     * Checks the level to make sure it is completable
     * @param mute      if muted there wil be no information log messages
     * @return {boolean} true if the level is completable
     */
    static Check(mute)
    {

        //Get a reference to the grid
        let grid = GVars.LevelViewer().Grid();


        //Get the data of the current settings
        let settings = GVars.Stats().Settings();

        //Make sure we have all required rooms
        if(!HtmlBridge.CheckRequiredRooms()) return false;

       //If we're here we know we have a start and an end tile, now do a path find
       let response = GVars.AI().TryPathFinder(grid);

       //Give the level view the path
       GVars.LevelViewer().SetPath(response.valid, response.path);

       if(response.valid)
       {
           //Check to make sure the grid has the right number of objects as per the settings
           let settingsCheck = grid.CheckObjectNum(settings);
           if(settingsCheck.valid)
           {
               GVars.LevelComplete().className = "levelComplete enable";
           }
           else
           {
               response.valid = false;
               response.reason = settingsCheck.reason;
           }
       }
       else
       {
           //Path is not valid
           GVars.LevelViewer().path_col = '#ff0021';
           GVars.LevelComplete().className = "levelComplete disable";

           //If the current setting allows for AI give tem the option to make a path
           if(GVars.Stats().Settings().canAI)
           {
               GVars.OverlayMan().OverlayOn(O_MAKE_PATH);
           }
       }


       //If this is not a muted check give the reason to the user
        if(!mute)
        {
            HtmlBridge.AddNewLineToLog(response.reason);
        }

       return response.valid;
    }

    /**
     * Sets up the environments to start a play testing session
     * @constructor
     */
    static StartPlayTest()
    {
        if(!HtmlBridge.Check()) return;

        GVars.Stats().MapStats().m_PlayTests++;

        GVars.StateMachine().ChangeState(new PlayLevelState(GVars.LevelViewer().Grid()),true);
    }

    /**
     *Clears the current level
     */
    static ClearLevel()
    {
        HtmlBridge.ClearAll();

        GVars.Stats().MapStats().m_NumReset++;

        HtmlBridge.AddNewLineToLog("Cleared Level");

        HtmlBridge.OverlayOff();
    }

    /**
     * The function that actually clears history, the level and the AI
     */
    static ClearAll()
    {
        GVars.AI().Predictor().Reset();
        GVars.Memento().Clear();
        GVars.LevelViewer().Clear();
    }

    static ToggleEditorPlayState(toggle_on)
    {
        let conainer = document.getElementById("levelViewerContainer");

        if(toggle_on)
        {
            conainer.className = "levelViewerPlay";
        }
        else
        {
            conainer.className = "levelViewerCreate";
        }
    }

    /**
     * Adds a new line to the information log
     * @param text  the text to be added
     */
    static AddNewLineToLog(text)
    {
        GVars.InfoLog().value += text + "\n\n";
        GVars.InfoLog().scrollTop = GVars.InfoLog().scrollHeight;
    }

    /**
     * Function to be called when the tip has been dismissed by the user
     */
    static TipContinue()
    {
        HtmlBridge.OverlayOff();
        HtmlBridge.ClearAll();

        GVars.Stats().StartMap();
    }

    static TutorialNext()
    {
        GVars.Stats().NextTutorial();
    }

    static TutorialStart()
    {
        GVars.Stats().Stats().p_DidTutorial = 1;
        GVars.Stats().NextTutorial();

    }
    static TutorialEnd()
    {
        GVars.Stats().StartQuestionnaire();
    }

    /**
     * Goes to result page
     */
    static GoToResults()
    {
        window.location.replace("../Results/index.html");
    }

    static ApplyGhostProps()
    {
        GVars.LevelViewer().Grid().ApplyGhosts();
    }

    /**
     * Handles the overlay response to the last question
     * @param ID    the ID of the quesiton asked
     * @param index the index of the response
     * @param type  the type of question
     * @constructor
     */
    static QuestionResponse(ID, index, type)
    {
        //If its a text response answer override index with input text value
        if(type === q_TEXT)
        {
            let text_field = document.getElementById(q_Code.htmlID);
            index = text_field.value;
        }

        //Send response to the stats manager
        GVars.Stats().QuestionResponse(ID, index);

        //Try to get the next question
        let q = GVars.Stats().GetNextQuestion();
        if(q)
        {
            GVars.OverlayMan().QuestionOn(q);
        }

    }

    /**
     * Completely clears the information log
     */
    static ClearInformationLog()
    {
        GVars.InfoLog().value = "";
    }


    /**
     * Atatches and creates a new html button with the given parameters
     * @param parent    the parent element
     * @param className the style
     * @param click     the on click function
     * @param content   what is inside the button
     * @param col       button colour
     * @return {HTMLElement}
     * @constructor
     */
    static AttachHtmlButton(parent, className, click, content, col, tool_tip = false)
    {
        let b = document.createElement('a');
        b.innerText = content;
        b.className = className;
        b.onclick = click;
        b.style.background = col || '#ffffff';

        if(tool_tip)
        {
            let s = document.createElement('span');
            s.className = 'tooltiptext';
            s.innerText = 'foobar';
            parent.appendChild(s);
            b.onmouseenter = function ()
            {

                s.style.visibility = 'visible';
            };
            b.onmouseleave = function ()
            {
              s.style.visibility = 'hidden';
            };
        }

        parent.appendChild(b);
        return b;
    }

    /**
     * Adds a tool bar button to the given parent
     * @param parent     the parent element to attach the button to
     * @param button_data the data that describes the buttons behaviour
     * @returns html element  returns the created html element
     */
    static AttachToolbarButton(parent, button_data)
    {
        //create the item in the list
        let li = document.createElement('li');

        //check for a button icon
        if(button_data.icon)
        {
            li.style.backgroundImage = 'url("'+ button_data.icon+'")';
        }
        else
        {
            li.style.background = button_data.colour;
        }

        //attach to the parent
        li.appendChild(this.AttachHtmlButton(li, "", button_data.delegate ,button_data.name, 'none'));
        parent.appendChild(li);
        return li;
    }

    /**
     * Attaches a text input field to the given parent
     * @param parent   parent to attach to
     * @param ID       ID of the input
     * @param className the style
     * @param text      content
     * @param type
     * @return {HTMLElement}
     * @constructor
     */
    static AttachTextInput(parent,ID,  className, text, type = "password")
    {
        let str = "...";
        if(text) str = text;

        let i = document.createElement("input");
        i.innerText = str;
        i.onfocus = function(){i.value = '';  i.type = type;};
        i.value = str;
        i.className = className;
        i.id = ID;
        i.type = "text";
        parent.appendChild(i);
        return i;
    }

    /**
     * Fills all existing rooms with the current prop model for each one
     * @returns {boolean}
     * @constructor
     */
    static FillAllRoomsWithProps()
    {
        //Make sure we can AI
        if(!GVars.Stats().Settings().canAI) return false;

        let rooms = GVars.LevelViewer().Grid().active_rooms;
        let keys = Object.keys(rooms);
        for(let i = 0; i < keys.length; i++)
        {
            if(rooms.hasOwnProperty(keys[i]))
            {
                let tiles = rooms[keys[i]].tiles;
                let id = rooms[keys[i]].roomID;

                if(GVars.AI().Predictor().GetCanSampleRoom(id))
                {
                    for(let j = 0; j < tiles.length;j++)
                    {
                        tiles[j].PropClear();
                    }
                    GVars.LevelViewer().TryApplyAIRoomFill(tiles[0].x, tiles[0].y, id);
                }
            }
        }
        return true;
    }
}
