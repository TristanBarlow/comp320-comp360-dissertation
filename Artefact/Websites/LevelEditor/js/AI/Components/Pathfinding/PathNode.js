/**
 * The class that is used in the path finding to generate the path
 */
class PathNode
{
    /**
     *
     * @param x position of node
     * @param y position of node
     */
    constructor(x,y)
    {
        //create the vec2 position
        this.pos = new Vector2(x,y);
        this.path_value =undefined;
        this.came_from = undefined;
        this.distance_to_goal = 10000000000;
        this.edges = [];
    }

    /**
     * Returns the string that is used to identify this node
     * @returns string the ID of the string
     */
    GetID()
    {
        return this.pos.toString();
    }

    /**
     * Gets the distance form this node to the given node
     * @param n  the node to check the distance to
     * @returns float this distance to the node
     * @constructor
     */
    Distance(n)
    {
        return this.pos.distance(n.pos);
    }

    /**
     * Call this function to draw a line to the to and from node
     * @param size of the square this node represents
     * @param col  the colour to draw the line
     * @param thickness of the line
     * @constructor
     */
    DrawLine(size, col, thickness)
    {
        let to = PathNode.CenterLine(this.came_from.pos, size);
        let from = PathNode.CenterLine(this.pos, size);
        GAZCanvas.Line(to, from, col, thickness);
    }

    /**
     * Centers the line into the middle of a tile
     * @param vec
     * @param size
     * @returns {Vector2} new pos
     * @constructor
     */
    static CenterLine(vec, size)
    {
        let v1 = Vector2.MultiplyTogether(vec, size);
        return Vector2.Add(v1, Vector2.Scale(size, 0.5));
    }
}