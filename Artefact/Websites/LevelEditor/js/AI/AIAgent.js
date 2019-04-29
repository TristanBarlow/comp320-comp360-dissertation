/**
 * This class encapsulates all the features the AI agent has.
 */
class AIAgent
{
    constructor()
    {
        this.pathFinder = new PathFinder();
        this.predictor  = new Predictor();
    }
}