/**
 * This class is used to draw the props and the tiles represented on the grid
 * Having it as part of a class means for the highlighting I dont have to overdraw existing sprites, just add to
 * the draw object before the draw call
 */
class SpriteDrawObject
{

    constructor(col)
    {
        this.colour = col || "#e8b5c5";
        this.my_rect = new Rect();
        this.props = [];
        this.border = [];
    }

    /**
     * Updates the draw settings of this tile
     * @param col   the colour of the drawobject
     * @param props  the props in this tile
     * @constructor
     */
    Update(col, props)
    {
        this.colour = col;

        if(props) this.props = props;
        else this.props.length = 0;
        this.border = [];
    }

    /**
     * Draws this object based on its settings
     * @constructor
     */
    Draw(is_game = false)
    {
        //draw rect
        GAZCanvas.Rect(this.my_rect, this.colour, true);


        //draw the props
        if(this.props && this.props.length>0)
        {
            this.DrawProps(is_game);
        }

        if(this.border && this.border.length >  0) this.DrawBoader();
    }

    /**
     * transforms two vectors by x and y
     * @param vec1
     * @param vec2
     * @param x
     * @param y
     * @constructor
     */
    static TransformLine(vec1, vec2, x, y )
    {
        vec1.x += x;
        vec2.x += x;
        vec1.y += y;
        vec2.y += y;
    }

    /**
     *
     * @param p prop to focus
     * @constructor
     */
    FocusProp(p)
    {
        if(this.props.length >= PROPS_PER_TILE)
        {
            this.props.pop();

        }
        this.props.push(p);
    }

    /**
     * Draws the borders for the sprite object
     * @constructor
     */
    DrawBoader()
    {
        let padding = S_BORDER_THICK/2;

        //loop through the border array and draw
        for(let i =0 ; i < this.border.length; i ++)
        {
            //Switch on type of border, draw according to type
            switch (this.border[i])
            {
                case B_TOP:
                {
                    let a = this.my_rect.GetTopLeft();
                    let b = this.my_rect.GetTopRight();
                    SpriteDrawObject.TransformLine(a, b, 0, padding);
                    GAZCanvas.Line(a, b, S_BORDER_COL, S_BORDER_THICK);
                    break;
                }
                case B_LEFT:
                {
                    let a = this.my_rect.GetTopLeft();
                    let b = this.my_rect.GetBottomLeft();
                    SpriteDrawObject.TransformLine(a, b, padding, 0);
                    GAZCanvas.Line(a, b, S_BORDER_COL, S_BORDER_THICK);
                    break;
                }
                case B_BOTTOM:
                {
                    let a = this.my_rect.GetBottomLeft();
                    let b = this.my_rect.GetBottomRight();
                    SpriteDrawObject.TransformLine(a, b, 0, -padding);
                    GAZCanvas.Line(a, b, S_BORDER_COL, S_BORDER_THICK);
                    break;
                }
                case B_RIGHT:
                {
                    let a = this.my_rect.GetBottomRight();
                    let b = this.my_rect.GetTopRight();
                    SpriteDrawObject.TransformLine(a, b, -padding, 0);
                    GAZCanvas.Line(a, b, S_BORDER_COL, S_BORDER_THICK);
                    break;
                }
            }
        }
    }

    /**
     * Draws all of the props belonging to this draw object
     * @constructor
     */
    DrawProps(is_game  = false)
    {

        //Calculate the room_entries of the prop rect, This could be static, but later things may change
        //during a session
        let x_size = this.my_rect.w / PROPS_PER_TILE;
        let y_size = this.my_rect.h * P_Y_RATIO;
        let x_pos = this.my_rect.x;
        let rec = new Rect(x_pos, this.my_rect.y + (this.my_rect.h - y_size), x_size, y_size);

        //loop through the props and draw
        for (let i = 0; i < this.props.length; i++)
        {

            rec.x =this.my_rect.x;

            //if there is only one prop center it
            rec.x = this.props.length>1 ? rec.x + (x_size*i): rec.x + x_size*0.5;

            let prop = GVars.ObjectManager().GetProp(this.props[i].p_id);
            let sprite = prop.sprite;

            //Only used for when we're in game mode
            if(is_game)
            {
                let opacity = this.props[i].GetHealthDecimal();
                if(this.props[i].dead)opacity = 1;
                GAZCanvas.Sprite(sprite, rec, undefined, opacity);
            }

            //If this prop is a ghostly one add draw with opacity
            else if (this.props[i].is_Ghostly)
            {
                GAZCanvas.Sprite(sprite, rec, undefined, S_GHOSTLY_OP);

            }
            else {
                GAZCanvas.Sprite(sprite, rec);
            }
        }

    }
}
