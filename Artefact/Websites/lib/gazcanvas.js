class gazcanvas
{
    /*
        This is my wrapper for resolution-independent canvas functionality.
        
        It assumes Canvas is defined (canvas.js)
        
        Usage:
            Wraps Canvas class functions and adds functionality for working out largest aspect correct rectange for
            given screen and appropriate offsets to centre it in screen.
            
            On application start-up, set referenceScreenSize(width,height) and application drawing will be scaled to that
            aspect ratio
            
            call GAZCanvas.update() at the beginning of each game / application update()
            use appropriate GAZxxx() functions for drawing
        
        see:
        
     */
    constructor()
    {
        this.currentScreenSize = new Size(0,0);
        this.referenceScreenSize = new Size(1920, 1080);
        this.canvas_size = new Size(1920, 1080);
        this.offset = new Vector2(0,0);
        this.targetSize = new Size(0,0);
        this.keep_aspect = true;
    }

    update()
    {
        let canvasRect = Canvas.GetCanvasRect();

        //clear canvas
        Canvas.ctx().clearRect(0, 0, canvasRect.w, canvasRect.h);
        Canvas.canvas.width = canvasRect.w;
        Canvas.canvas.height = canvasRect.h;
        this.canvas_size.w = canvasRect.w;
        this.canvas_size.h = canvasRect.h;


        this.offset.x = canvasRect.x;
        this.offset.y = canvasRect.y;
        this.currentScreenSize.w = window.innerWidth;
        this.currentScreenSize.h = window.innerHeight;

        if(this.keep_aspect)
        {
            this.targetSize.w = canvasRect.w / this.referenceScreenSize.w;
            this.targetSize.h = canvasRect.h / this.referenceScreenSize.h;
        }
        else
        {
            this.targetSize.w =1;
            this.targetSize.h = 1;
        }

    }

    toScreenSpace(inRect)
    {
        var drawRect = new Rect();
        drawRect.x = inRect.x ;
        drawRect.y = inRect.y ;
        drawRect.w = inRect.w * this.targetSize.w;
        drawRect.h = inRect.h * this.targetSize.h;


        return drawRect;
    }

    toScreenVec(vec)
    {
       vec.x =  ((vec.x / this.referenceScreenSize.w) * this.targetSize.w) + this.offset.x/2;
       vec.y =  ((vec.y / this.referenceScreenSize.h) * this.targetSize.h) + this.offset.y/2;
    }


    /*
        Line(vector2 start, vector2 end, string inColour, float inWidth)
        
        This will draw a line between start and end
        
        inWidth is optional
     */
    
    Line(start,end,inColour, inWidth)
    {
        var r = new Rect();
        
    
        r.set(start.x,start.y,0,0);
        r = this.toScreenSpace(r);
        
        var v0 = new Vector2(r.x,r.y);
        
    
        r.set(end.x,end.y,inWidth,inWidth);
        r = this.toScreenSpace(r);
        
        var width = Math.min(r.w,r.h);
    
        var v1 = new Vector2(r.x,r.y);
        
        Canvas.Line(v0,v1,inColour, width);
    }

    Circle(rect, col, filled, inWidth = 1)
    {
        Canvas.Circle(this.toScreenSpace(rect), col, filled, inWidth);
    }

    /*
        Text(float inSize,string inString, vector2 inPos, string inColour, string inJustification,string font)
        
        This will draw text
            
            inJustification - 'start', 'left', 'centre', 'end', 'right'
     */
    Text(inSize,inString,inPos,inColour,inJustification,font)
    {
        var r = new Rect();

        r.set(inPos.x,inPos.y,inSize,inSize);
        r = this.toScreenSpace(r);

        Canvas.Text(r.h, inString, new Vector2(r.x,r.y),inColour,inJustification,font);
    }
    
    /*
        Rect(Rect inRect,string inColour, bool inFilled, float inWidth)
        
        Draw Rectangle
            inRect      - containing rectangle (see rect.js)
            inColour    - RGB colour as string
            inFilled    - optional bool, whether rectangle is filled our outline only
            inWidth     - optional float, thickness of outline
     */

    Rect(inRect,inColour, inFilled,inWidth)
    {
        Canvas.Rect(this.toScreenSpace(inRect), inColour,inFilled,inWidth);
    }
    
    /*
        Sprite(image,inRect,uvRect)
        
        Draw rectangle with texture (or texture region)
            image   - Image() object
            inRect  - containing rectangle (see rect.js)
            uVRect  - (optional) texture co-ordinates in pixels
                      if ommitted, full image will be drawn
     */
    Sprite(image,inRect,uvRect, opacity = 1)
    {
        var rect = this.toScreenSpace(inRect);
        Canvas.Sprite(image,rect,uvRect, opacity);
    }
    
    /*
        drawLetterbox(oolour)
        
        Draw a letterbox on canvas
            colour    - RGB colour as string
     */
    drawLetterbox(colour)
    {
        var rect = this.toScreenSpace(new Rect(0,0,this.referenceScreenSize.w,this.referenceScreenSize.h));
        
        if(rect.x > 0)
        {
            //left + right letterbox
            
            Canvas.Rect(new Rect(0,0,rect.x,rect.h),colour);
            Canvas.Rect(new Rect(rect.x+rect.w,0,this.currentScreenSize.w-(rect.x+rect.w),rect.h),colour);
            
        }
        //else
        {
            //top + bottom
            Canvas.Rect(new Rect(0,0,rect.w,rect.y),colour);
            Canvas.Rect(new Rect(0,rect.h+(this.offset.y/2),rect.w,this.currentScreenSize.h - rect.h+(this.offset.y/2)),colour);
        }
    }
    
}

GAZCanvas = new gazcanvas();

