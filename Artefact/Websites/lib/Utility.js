/*
*  This class is used to store useful STATIC functions for things i cannot be bothered retyping
*
*
* */

class Utility
{
    static GenerateRandomNumber(max, min)
    {

        return Math.random() * (max - min) + min;
    }

    static GenerateRandomVec3(max, min)
    {
        return new Vector3(this.GenerateRandomNumber(max, min),this.GenerateRandomNumber(max, min),this.GenerateRandomNumber(max, min));
    }

    static Round(val, places)
    {
        return (Math.floor(Math.pow(10, places) * val))/Math.pow(10, places);
    }

}