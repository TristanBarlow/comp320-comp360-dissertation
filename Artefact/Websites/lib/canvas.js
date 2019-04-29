class baseCanvas
{
    /*
        This is my wrapper for canvas functionality.
                    
        It assumes the canvas component is called 'canvas' in the index.html file
        
        Is implemented as global Canvas object, defined at end of file
        
        Usage:
            Canvas.Line(...)
        
        see:
            https://www.w3schools.com/tags/ref_canvas.asp
     */
    constructor()
    {
        this.rect = new Rect(0,0,1920,1080);
        this.context =false;
        this.canvas = false;
    }
    
    // ctx() - return the 2D canvas context
    ctx()
    {
        if(!this.canvas  || !this.context)
        {
            this.canvas = document.getElementById("canvas");
            this.context = this.canvas.getContext("2d");
        }
        return this.context;
    }




    GetWebGL()
    {

        if(this.canvas == null)
        {
            var canvas = document.getElementById("canvas");
        }
        return canvas.getContext("webgl");
    }
    /*
        Line(vector2 start, vector2 end, string inColour, float inWidth)
        
        This will draw a line between start and end
        
        inWidth is optional
     */
    Line(start,end,inColour,inWidth)
    {
        this.ctx().beginPath();
        if(inWidth == undefined)
        {
            this.ctx().lineWidth = 1;
        }
        else
        {
            this.ctx().lineWidth = inWidth;
        }
        this.ctx().strokeStyle = inColour;
        this.ctx().moveTo(start.x,start.y);
        this.ctx().lineTo(end.x,end.y);
        this.ctx().stroke();
    }

    GetCanvasElement()
    {
        if(this.canvas === null)
        {
            this.canvas = document.getElementById("canvas");
        }
        return this.canvas;
    }

    GetCanvasRect()
    {
        if(!this.GetCanvasElement())return this.rect;
        let boundingRect =this.GetCanvasElement().getBoundingClientRect();
        this.rect.set(boundingRect.left, boundingRect.top, boundingRect.width, boundingRect.height)
        return this.rect

    }
    /*
        Text(float inSize,string inString, vector2 inPos, string inColour, string inJustification,string font)
        
        This will draw text in the canvas, see:
            https://www.w3schools.com/tags/canvas_filltext.asp
            https://www.w3schools.com/tags/canvas_textalign.asp
            
            inJustification - 'start', 'left', 'centre', 'end', 'right'
     */
    Text(inSize,inString,inPos,inColour,inJustification,font)
    {
        if(font == undefined)
        {
            this.ctx().font = inSize +"px san-serif";
        }
        else
        {
            this.ctx().font = inSize +"px "+font;//Archivo Black";
        }
        this.ctx().textAlign = inJustification;
        this.ctx().fillStyle = inColour;

        if(inJustification == 'center')
        {
            this.ctx().fillText(inString,inPos.x,inPos.y+(inSize/4));
        }
        else
        {
            this.ctx().fillText(inString,inPos.x,inPos.y);
        }
    }
    
    /*
        Rect(Rect inRect,string inColour, bool inFilled, float inWidth)
        
        Draw Rectangle
            inRect      - containing rectangle (see rect.js)
            inColour    - RGB colour as string
            inFilled    - optional bool, whether rectangle is filled our outline only
            inWidth     - optional float, thickness of outline
        see:
            https://www.w3schools.com/tags/canvas_fillrect.asp
            https://www.w3schools.com/tags/canvas_strokerect.asp
     */
    Rect(inRect,inColour, inFilled,inWidth)
    {
        if(inWidth !== undefined)
        {
            this.ctx().lineWidth = inWidth;
        }
        else
        {
            this.ctx().lineWidth = 1;
        }
        
        if((inFilled === undefined) || (inFilled === true))
        {
            this.ctx().fillStyle = inColour;
            
            this.ctx().fillRect(inRect.x, inRect.y, inRect.w, inRect.h);
        }
        else
        {
            this.ctx().strokeStyle = inColour;
            this.ctx().strokeRect(inRect.x, inRect.y, inRect.w, inRect.h);
        }
    }


    Circle(rect, col, filled, inWidth = 1)
    {
        this.ctx().beginPath();
        this.ctx().fillStyle = col || '#ff000d';
        this.ctx().lineWidth = inWidth;
        this.ctx().ellipse(rect.x, rect.y, rect.w, rect.h,0, 0, 2 * Math.PI);

        if(!filled)this.ctx().stroke();
        else this.ctx().fill();
    }

    /*
        Sprite(image,inRect,uvRect)
        
        Draw rectangle with texture (or texture region)
            image   - Image() object
            inRect  - containing rectangle (see rect.js)
            uVRect  - (optional) texture co-ordinates in pixels
                      if ommitted, full image will be drawn
        see:
            https://www.w3schools.com/tags/canvas_drawimage.asp
     */
    Sprite(image,inRect,uvRect, opacity = 1)
    {
        if(opacity <1)
        {
            this.ctx().globalAlpha = opacity;
        }
        if((image != null) && (image.width >0))
        {
            if(uvRect == undefined)
            {
                this.ctx().drawImage(image
                    ,Math.floor(inRect.x)
                    ,Math.floor(inRect.y)
                    ,Math.floor(inRect.w)
                    ,Math.floor(inRect.h) );
            }
            else
            {
                try
                {
                    this.ctx().drawImage(image
                        ,uvRect.x,uvRect.y,uvRect.w,uvRect.h
                        ,inRect.x,inRect.y,inRect.w,inRect.h
                    );
                }
                catch(err)
                {
                    alert(err);
                }
            }
        }
        else
        {
            if(false)
            {
                this.Rect(inRect, '#ff0000');
            }
        }

        if(opacity <1)
        {
            this.ctx().globalAlpha = 1;
        }
    }
}


Canvas = new baseCanvas();