const INPUT_NOT_PRESSED = 'not_pressed';
const INPUT_PRESSED = 'pressed';
const INPUT_HELD = 'held';
const INPUT_RELEASED = 'released';
const KEY_DOWN = 'down';
const KEY_UP = 'up';

class InputClass
{
    /*
        This is my wrapper for resolution-independent input functionality.
        
        It assumes GAZCanvas is defined (gazcanvas.js)
        
        Usage:
            Provides user input (keyboard & mouse) with resolution dependent mouse positions based on GAZCanvas
            (see GAZCanvas).
            
            Input devices will return INPUT_NOT_PRESSED, INPUT_PRESSED, INPUT_HELD & INPUT_RELEASED
            
            Mouse will return off screen when pointer is outside of GAZCanvas space
            
            call Input.upate() per frame
            
            Input.getKeystate(key) where key is defined in input_keycode.js
        
        see:
        
     */
    
    constructor()
    {
        this.mouseLogicalPos = new Vector2();
        this.mouseAbsolutePos = new Vector2();
        this.oldAbsMousePos = new Vector2();

        this.deltaTime = 0;
        this.date = new Date();
        this.deltaTimeSec = 0;
        this.lastUpdateTime = this.date.getTime();

        this.frameCounter = 0;
        this.fps = 0;
        this.framespeed = 0;
        this.fpsUpdateInterval = 1;
        this.timeSinceLastUpdate = this.fpsUpdateInterval;


        this.currentKeyState = new Array(256);
        this.oldKeyState = new Array(256);
        this.rawKeyState = new Array(256);

        this.mouse_direction = new Vector2(0,0);
        this.mouse_magnitude = 0;

        for(let i=0;i<256;i++)
        {
            this.currentKeyState[i] = INPUT_NOT_PRESSED;
            this.oldKeyState[i] = this.currentKeyState[i];
            this.rawKeyState[i] = '';
        }
        
        this.mouseRawState = '';
        this.currentMouseState = INPUT_NOT_PRESSED;
        this.oldMouseState = this.currentMouseState;
    }

    UpdateMouseDirection()
    {

    }

    IsMousePressed()
    {
        return this.currentMouseState === INPUT_PRESSED;
    }

    IsMouseHeld()
    {
        return this.currentMouseState === INPUT_HELD || Input.IsMousePressed();
    }

    
    // Callbacks for EventListeners

    getRelativeMouseMovement()
    {
        return Vector2.Subtract(this.mouseLogicalPos, this.oldAbsMousePos);
    }

    onMouseMove(event)
    {

        Input.mouseLogicalPos = Input.getMousePos(event);


    }
    
    onMouseDown(event)
    {
        Input.mouseDown = true;
        Input.mouseLogicalPos = Input.getMousePos(event);
    
        Input.mouseRawState = 'down';
    }
    
    onMouseUp(event)
    {
        Input.mouseDown = false;
        Input.mouseLogicalPos = Input.getMousePos(event);

        Input.mouseRawState = 'up';
    }
    
    onKeyDown(event)
    {
        Input.rawKeyState[event.keyCode] = KEY_DOWN;
    }
    
    onKeyUp(event)
    {
        Input.rawKeyState[event.keyCode] = KEY_UP;
    }
    
    getMousePos(event)
    {
        let rawMousePos = new Vector2(event.pageX, event.pageY);


        this.mouseAbsolutePos.set(rawMousePos);
    
        let screenRect = Canvas.GetCanvasRect();
        screenRect = GAZCanvas.toScreenSpace(screenRect);
    
        if(screenRect.isInMe(rawMousePos) === true)
        {
            // convert screen space to renderspace
            rawMousePos.x -= screenRect.x;
            rawMousePos.y -= screenRect.y;
        
            rawMousePos.x /= screenRect.w;
            rawMousePos.y /= screenRect.h;
        
            rawMousePos.x *= GAZCanvas.referenceScreenSize.w;
            rawMousePos.y *= GAZCanvas.referenceScreenSize.h;

            return rawMousePos;
        }
        return undefined;
    }
    
    getKeystate(key)
    {
        return this.currentKeyState[key];
    }
    
    update()
    {
        //Calculate the delta time
        this.date = new Date();
        this.deltaTime = this.date.getTime() - this.lastUpdateTime;
        this.deltaTimeSec = this.deltaTime/1000;
        this.lastUpdateTime = this.date.getTime();

        //Calculate frames based on number of frames counted
        this.frameCounter++;
        this.timeSinceLastUpdate += this.deltaTimeSec;
        if(this.timeSinceLastUpdate - this.fpsUpdateInterval >= 0)
        {
            this.fps = Math.floor(this.frameCounter/this.fpsUpdateInterval);
            this.framespeed = Utility.Round((this.timeSinceLastUpdate*1000)/this.frameCounter,1);
            this.timeSinceLastUpdate = 0;
            this.frameCounter = 0;
        }

        this.oldMouseEvent = this.mouseDown;
        this.oldMouseState = this.currentMouseState;


        this.currentMouseState = this._processState(this.currentMouseState, this.mouseRawState);
        this.mouseRawState = '';
        
        for(let i=0;i<256;i++)
        {
            this.currentKeyState[i] = this._processState(this.currentKeyState[i], this.rawKeyState[i]);
            this.rawKeyState[i] = '';
        }

        if(this.oldAbsMousePos)
        {
            //Set mouse direction
            this.mouse_direction.x = this.oldAbsMousePos.x - this.mouseAbsolutePos.x;
            this.mouse_direction.y = this.oldAbsMousePos.y - this.mouseAbsolutePos.y;
            this.oldAbsMousePos.set(this.mouseAbsolutePos);
        }
        else
        {
            this.mouse_direction.x =0;
            this.mouse_direction.y =0;
        }
    }

    isKeyHeldOrPressed(key)
    {
        return this.getKeystate(key) === INPUT_HELD || this.getKeystate(key) === INPUT_PRESSED;
    }

    onTouchMove(event)
    {
        var touch = event.touches[0] || event.changedTouches[0];
        Input.onMouseMove(touch);
    }
    
    _processState(thing, state)
    {
        switch(thing)
        {
            case INPUT_PRESSED:
            {
                if (state === 'up')
                {
                    return INPUT_RELEASED;
                }
                else
                {
                    return INPUT_HELD;
                }
            }
            break;
    
            case INPUT_HELD:
            {
                if (state === 'up')
                {
                    return INPUT_RELEASED;
                }
        
                return INPUT_HELD;
            }
            break;
            
            case INPUT_RELEASED:
            {
                if (state === 'down')
                {
                    return INPUT_PRESSED;
                }
        
                return INPUT_NOT_PRESSED;
            }
            break;
    
            case INPUT_NOT_PRESSED:
            {
                if (state === 'down')
                {
                    return INPUT_PRESSED;
                }
            }
            break;
        }
        
        return INPUT_NOT_PRESSED;
    }
}

Input = new InputClass();

window.addEventListener('touchstart',Input.onMouseDown);
window.addEventListener('touchmove' ,Input.onTouchMove);
window.addEventListener('touchend'  ,Input.onMouseUp);

window.addEventListener('mousemove' ,Input.onMouseMove);
window.addEventListener('mouseup'   ,Input.onMouseUp);
window.addEventListener('mousedown' ,Input.onMouseDown);
window.addEventListener('keydown'   ,Input.onKeyDown);
window.addEventListener('keyup'     ,Input.onKeyUp);



