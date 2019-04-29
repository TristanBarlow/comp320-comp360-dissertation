/**
 * Perhpas the bridge design pattern is not needed right now, but the easier interface to interact with any
 * AI agents may prove to be more useful
 */
class AIBridge
{
    constructor()
    {
        this.agent  =new AIAgent();
    }

    /**
     * Performs an Astart path find using the default ai agent
     * @param grid  grid to path find
     * @returns {{valid, reason, path, from_start}}
     * @constructor
     */
    TryPathFinder(grid)
    {
        return this.agent.pathFinder.GetClosestPath(grid);
    }


    /**
     * This function uses a-star pathfinding to determined the best route from the start to the end
     * @param tile_array  this should be the array of tiles the grid is made of
     * @param start  the position of the start vec2
     * @param end    the position of the end vec2
     * @returns {{valid, reason, path}}  (valid = bool, reason = description of result, path = the path)
     * @constructor
     */
    GetGamePathFinding(tile_array, start, end)
    {
        return this.agent.pathFinder.AStarPathFind(tile_array, start, end);
    }

    /**
     * Gets a the shortest path between two rooms(goes through walls)
     * @param tile_array  the array of tiles to check
     * @param start   the start point
     * @param end      the end point
     * @returns {{valid, reason, path}}
     * @constructor
     */
    GetPathBetweenRooms(tile_array, start, end)
    {
        return this.agent.pathFinder.AStarPathFind(tile_array, start, end, true, true);
    }


    /**
     * Returns a reference to the predictor aspect of the AI agent
     * @returns {Predictor}
     * @constructor
     */
    Predictor()
    {
        return this.agent.predictor;
    }

}