const URL_LOCAL = "http://localhost:8080/";
const URL_SERVER = "https://tristanbarlowgriffin.co.uk:8080/";
const URL_ACTIVE = URL_SERVER;

class PostHandler
{

    /**
     * Sends json data to the server
     * @param dictionary  the json dict to send
     * @param responseDelegate the function to be called when the response has been received
     * @param url url to send the data to
     */
    static SendJsonData(dictionary, responseDelegate, url)
    {
        var xhr = new XMLHttpRequest();
        //
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState === 4 && xhr.status === 200)
            {
                let str = "";
                try {

                    //Sanitise and extract only json data
                     str= xhr.response;
                }
                catch (e)
                {
                    console.log("Could not parse message: " + xhr.response);
                    return;
                }
                if(responseDelegate)
                {
                    responseDelegate(str);
                }
            }
        };
        var data = JSON.stringify(dictionary);
        xhr.send(data);
    }

    /**
     * This is the function that should be used to interface with the server
     * @param type     the type of message (changes how the server handles the data)
     * @param password  the password the user is using
     * @param dictionary the body of the message
     * @param responseDelegate the function to be called when we get a response
     * @param url
     * @constructor
     */
    static SendPostMessage(type, password, dictionary, responseDelegate, url = URL_ACTIVE)
    {
        let message = {};
        message.type     = type;
        message.password = password;
        message.message  = dictionary;
        this.SendJsonData(message, responseDelegate, url);
    }

    /**
     * Sends a GET message to the given url
     * @param msg  msg to send
     * @param url  where to make the Get request
     * @constructor
     */
    static SendGet(msg, url = URL_ACTIVE)
    {
        var xhr = new XMLHttpRequest();
        //
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
        xhr.send(msg);
    }
}