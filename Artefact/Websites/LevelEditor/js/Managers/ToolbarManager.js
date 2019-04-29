/**
 * This class is used as a container class for interacting with the tool bar.
 */
class ToolbarManager
{
    constructor()
    {
        this.buttons = {};
        this.toolbar = document.getElementById('toolbar');
        this.AddButtonsToHeader(TOOLBAR_DEFAULT_BUTTONS);
    }

    AddButtonsToHeader(new_buttons)
    {
        for(let i = 0; i < new_buttons.length; i++)
        {
            if(!this.buttons.hasOwnProperty(new_buttons[i].name))
                this.buttons[new_buttons[i].name] = HtmlBridge.AttachToolbarButton(this.toolbar, new_buttons[i]);
        }
    }

    RemoveButtons(to_go)
    {
        for(let i =0; i < to_go.length; i++)
        {
            //check we have a button of that name
            if(this.buttons.hasOwnProperty(to_go[i].name))
            {
                //remove button from html
                let element = this.buttons[to_go[i].name];
                element.parentNode.removeChild(element);

                //remove button  from dict
                delete this.buttons[to_go[i].name];
            }
        }
    }
}