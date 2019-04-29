/**
 * Class that handles all things to do with path finding
 */
class PathFinder
{
    constructor()
    {
        this.nodes = {};
        this.start = undefined;
        this.end = undefined;
    }

    /**
     * Creates An edge struct when given two positions
     * @param x1  x pos of first node
     * @param y1  y pos of first node
     * @param x2  x pose of second node
     * @param y2  y pose of second node
     * @returns {{from: *, to: *, length: *}} A struct containing the node data,
     */
    MakeEdge(x1,y1, x2, y2)
    {
        let v = new Vector2(x1, y1);
        let v2 = new Vector2(x2, y2);
        return{from: this.nodes[v.toString()], to: this.nodes[v2.toString()],  length: v.distance(v2) };
    }

    /**
     * This function tests both from the start and the end tile, choosing the path that is the closest to the other
     * @constructor
     */
    GetClosestPath(grid)
    {
        //Get start end tile
        let start_end = grid.GetStartAndEndTile();

        let start_response = this.AStarPathFind(grid.GetTileArray(), start_end.start.GetVec(), start_end.end.GetVec());

        start_response.from_start = true;

        //Check to see if the response is a valid path, if so return it
        if (start_response.valid) return start_response;

        //check to see if starting from the end yields a closer result
        let end_response = this.AStarPathFind(grid.GetTileArray(), start_end.end.GetVec(), start_end.start.GetVec());

        end_response.from_start = false;

        //Return if the either path is null
        if (!start_response.path || !start_response.path[0] ) return end_response;
        if (!end_response.path || !end_response.path[0]) return start_response;

        //return the path closer to the goal
        return (start_response.path[0].distance_to_goal <= end_response.path[0].distance_to_goal) ? start_response : end_response;
    }

    /**
     * Performs an A star path find, it returning if the response is valid and the path if there is one
     * Code adapted from Comp260 Python example
     * @param tile_array the tile array to perform the pathfinding on
     * @param start_pos the start position of the path finder
     * @param end_pos  the goal of the path finder
     * @param include_all
     * @param ingore_end if true it will not include the end tile as a path
     * @returns {valid: boolean, reason: string, path: Array}

     */
    AStarPathFind(tile_array, start_pos, end_pos, include_all = false, ingore_end = false)
    {

        //Make AStar nodes from the grid
        this.MakeNodes(tile_array, include_all, ingore_end);

        //Set the start end tile
        this.start = this.nodes[start_pos] || this.nodes[Object.keys()];
        this.end   = this.nodes[end_pos];

        //Init visited nodes
        let visited = {};
        let g = [];


        //Create an array of structs of type {distance: distance to the end goal, node: the node in the queue}
        let queue = [{distance: this.start.Distance(this.end), node: this.start}];

        //default init
        this.start.path_value = 0;
        let current_node;
        let closest;

        while(queue && queue.length >0)
        {
            //Sort our queue based on distance
            queue.sort((a,b) => (a.distance < b.distance) ? 1 : ((b.distance < a.distance) ? -1 : 0));

            //Get the top most value in the queue (smallest distance)
            let entry = queue.pop();
            current_node = entry.node;

            //Add it to the visited dict
            visited[current_node.GetID()] = 1;

            //check to see if we're at the end tile
            if(current_node.GetID() === this.end.GetID())
            {
                return {valid: true, reason: "The map is completable" ,path: PathFinder.ReconstructPath(current_node)};
            }

            //init vars
            let distance_so_far = 0;
            let current_path_value = 0;

            //Generated and set edges
            let edges = this.GetNodeEdges(current_node.pos.x, current_node.pos.y);
            current_node.edges = edges;


            //Loop through edges testing for the best path
            for(let i =0; i < edges.length;i++)
            {
                let edge = edges[i];
                if (!visited.hasOwnProperty(edge.to.GetID()))
                {
                    distance_so_far = current_node.path_value + edge.length;

                    if (edge.to.path_value === undefined)
                    {
                        current_path_value = 10000;
                    }
                    else
                        {
                        current_path_value = edge.to.path_value;
                    }

                    if (distance_so_far < current_path_value)
                    {
                        edge.to.came_from = current_node;
                        let distance_to_goal = edge.to.pos.distance(this.end.pos);
                        edge.to.path_value = distance_so_far;
                        edge.to.distance_to_goal = distance_to_goal;

                        //Check for best path so far
                        if(!closest)
                        {
                            closest = edge.to;
                        }

                        //Set the closest node so far
                        if(edge.distance_to_goal === closest.distance_to_goal)
                        {

                            if (edge.to.path_value < closest.path_value) closest = edge.to;

                        }
                        else if(edge.to.distance_to_goal <= closest.distance_to_goal)
                        {
                            closest = edge.to;
                        }


                        queue.push({distance: distance_so_far + distance_to_goal, node: edge.to});

                    }

                }
            }

        }
        return {valid: false, reason : "There is no path from the start to the end", path : PathFinder.ReconstructPath(closest)};
    }

    /**
     * Returns whether or not the position at x,y is walkable. As the only nodes in nodes are walkable its a
     * simple check to see if they're in there
     * @param x pos
     * @param y pos
     * @returns {boolean} if it can or cannot be walked on
     * @constructor
     */
    IsWalkable(x, y)
    {
        return this.nodes.hasOwnProperty(Vector2.ToString(x, y));
    }

    /**
     * Get the edges surrounding a given node
     * @param x position of the tile to build edges around
     * @param y position of the tile to build edges around
     * @returns {Array} Array of edges
     * @constructor
     */
    GetNodeEdges(x, y)
    {
        let edges = [];
        if(this.IsWalkable(x+1,y)) edges.push(this.MakeEdge(x,y, x+1,y));
        if(this.IsWalkable(x-1,y)) edges.push(this.MakeEdge(x,y, x-1,y));
        if(this.IsWalkable(x,y-1)) edges.push(this.MakeEdge(x,y, x,y-1));
        if(this.IsWalkable(x,y+1)) edges.push(this.MakeEdge(x,y, x,y+1));
        return edges;
    }

    /**
     * Converts the grid and fill this.nodes with the new generated nodes
     * @param tile_array   The tile array to sample from
     * @param include_all
     * @param ignore_end if it should ignore the end tile
     * @constructor
     */
    MakeNodes(tile_array, include_all, ignore_end)
    {

        this.nodes = {};

        //Loop through all of the tiles and generate path nodes from them
        for(let i = 0; i < tile_array.length;i++)
        {
           let tile = tile_array[i];

           if(ignore_end && tile.r_id ===R_END_ID)continue;

           //Make sure the tile of this type can be walked on
            if (GVars.ObjectManager().GetRoom(tile.r_id).isPath || include_all)
            {
                //Make the new node
                let node = new PathNode(tile.x, tile.y);

                //Set the key of the node as the string position
                this.nodes[node.GetID()] = node;
            }
        }


    }

    /**
     * Reconstructs the path from the given node
     * @param n node to reconstruct from
     * @returns {Array} the array of the path
     * @constructor
     */
    static ReconstructPath(n)
    {
        let node = n;
        let path = [];
        while(node)
        {
            path.push(node);
            node = node.came_from;
        }
        return path;
    }
}
