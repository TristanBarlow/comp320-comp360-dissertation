/**
 * Created by gareth on 04/06/2018.
 */

class Rect
{
    /*
        Rect - 2D rectangle of x,y,width & height
     */
    constructor(x,y,w,h)
    {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;

        if(x != undefined)
        {
            this.x = x;
        }

        if(y != undefined)
        {
            this.y = y;
        }

        if(w != undefined)
        {
            this.w = w;
        }

        if(h != undefined)
        {
            this.h = h;
        }
    }
    
    set(x,y,w,h)
    {
        if(x != undefined)
        {
            this.x = x;
        }
        
        if(y != undefined)
        {
            this.y = y;
        }
        
        if(w != undefined)
        {
            this.w = w;
        }
        
        if(h != undefined)
        {
            this.h = h;
        }
    }

    CanContain(rect)
    {
        return (rect.x >= this.x && (rect.x + rect.w) <= (this.w + this.x)) &&
               (rect.y >= this.y && (rect.y + rect.h) <= (this.h + this.y));
    }

    /*
        isInMe(Vector2 inVal)
        
        is Vector2 inVal inside rectangle
    */
    isInMe(inVal)
    {
        if(inVal !== undefined)
        {
            if( (inVal.x >= this.x) && (inVal.x < (this.x + this.w)) && (inVal.y >= this.y) && (inVal.y < (this.y + this.h)) )
            {
                return true;
            }
        }
        
        return false;
    }

    IsInMe(x, y)
    {
        return (x >= this.x) && (x < (this.x + this.w)) && (y >= this.y) && (y < (this.y + this.h));
    }

    GetTopLeft(){return new Vector2(this.x, this.y);}
    GetTopRight(){return new Vector2(this.x + this.w, this.y);}
    GetBottomRight(){return new Vector2(this.x + this.w, this.y + this.h);}
    GetBottomLeft(){return new Vector2(this.x, this.y + this.h);}

    Clone()
    {
        return new Rect(this.x, this.y, this.w, this.h);
    }

    static Multiply(r1, v)
    {
        return new Rect(r1.x, r1.y, r1.w*v, r1.h*v);
    }

    getCentre()
    {
        return new Vector2(this.x+(this.w/2),this.y+(this.h/2));
    }
}
