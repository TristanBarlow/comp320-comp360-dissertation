class Vector2
{
    /*
        Vector2 - Standard Vector2 class
     */
    constructor(x,y)
    {
        this.x = x || 0;
        this.y = y || 0;
    }

    set(vec)
    {
        this.x = vec.x;
        this.y = vec.y;
    }

    Equal(vec)
    {
        return this.x === vec.x && this.y === vec.y;
    }
    
    clone()
    {
        return new Vector2(this.x,this.y);
    }

    normalize()
    {
        var length = this.length();

        this.x/= length;
        this.y/= length;
    }

    static Scale( v, i)
    {
        return new Vector2(v.x*i, v.y*i );
    }

    static Angle(a, b)
    {
        a.normalize();
        b.normalize();

        let cosine = Vector2.Dot(a,b);

        if(cosine > 1.0)
        {
            return 0;
        }
        else if(cosine < -1.0)
        {
            return Math.PI;
        } else
        {
            return Math.acos(cosine);
        }
    }

    GetNormalize()
    {
        var length = this.length();
        return new Vector2(this.x/length, this.y/length);
    }

    Multiply(v)
    {
        this.x *= v;
        this.y *= v;
    }

    distance(v0)
    {
        return Math.sqrt(Math.pow(this.x-v0.x,2) + Math.pow(this.y-v0.y,2));
    }
    length()
    {
        return Math.sqrt((this.x*this.x) + (this.y*this.y));
    }

    static normal(vec)
    {
        var result = new Vector2(vec.x, vec.y);

        result.normalize();

        return result;
    }

    static Subtract(v1, v2)
    {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    static Add(v1, v2)
    {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    static Dot(v0,v1)
    {
        return (v0.x * v1.x) + (v0.y * v1.y);
    }
    
    toString()
    {
        return "X: "+this.x+ "  Y: " + this.y;
    }


    static ToString(x, y)
    {
        return "X: "+x+ "  Y: " + y;
    }

    static MultiplyTogether(v1, v2)
    {
        return new Vector2(v1.x * v2.x, v1.y * v2.y);
    }
}

/**
 * Try and export module
 */
try {
    module.exports = {Vector2};
} catch (e) {}