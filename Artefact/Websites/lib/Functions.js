/**
 * Returns the current time in ms
 * @return {number} the time in ms;
 */
function GetTimeMS()
{
    return new Date().getTime();
}

/**
 * Shuffles an array
 * @param a the array to be shuffled
 * @returns {*}
 */
function shuffle(a)
{
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Adds the frequency_dict of dict 2 to dict 1
 * @param dict_1
 * @param dict_2
 * @constructor
 */
let AddDictValues = function (dict_1, dict_2)
{
    let keys = Object.keys(dict_2);
    let total = 0;
    for(let i = 0; i < keys.length; i++)
    {
        let key = keys[i];
        if(dict_1.hasOwnProperty(key))
        {
            dict_1[key] += dict_2[key];
        }
        else
        {
            dict_1[key] = dict_2[key];
        }
    }
    return;
};

function ObjClone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}