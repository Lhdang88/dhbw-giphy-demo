
/**
 * @description Main Entry - creates an Express Server on Port 3000.
 */

/**
 * dependencies - reference modules with require-keyword
 */
const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');

/**
* variables - here you can define local variables
*/
const PORT = process.env.PORT || 8080;
const GIPHY_API_KEY = process.env.GIPHY_API_KEY || '123456789';
const GIPHY_URL = 'https://api.giphy.com/v1/gifs/random'

console.log(`giphy key is: ${GIPHY_API_KEY}`);

// initialize the express http-module
let app = express();
app.use(bodyParser.json());

// start the http-server on port:xxxx
app.listen(PORT, function() {
  console.log(`App is listening on port ${PORT}`);
});

// register middlewares and APIs

app.use((req, res, next) => {
    // log all requests
    console.info(`Time: ${new Date()} Request: [${req.method}] ${req.originalUrl}`);
    next();
});

app.get('/giphy', (req, res) => {
    const options = {
        uri: GIPHY_URL,
        qs: {
            api_key: GIPHY_API_KEY, // -> uri + '?api_key=xxxxx%20xxxxx'
            tag: req.query.keyword
        },
        json: true
    };
     
    rp(options)
        .then(result => {
            //console.log(result);
            console.log(`redirecting to ${result.data.embed_url}`);
            res.redirect(302, result.data.embed_url);
        })
        .catch(err => {
            // API call failed...
            res.status(500);
            res.send({msg: 'Giphy Call failed', error: err});
        });
});
console.log(`*** API [GET] /giphy registered`);

/**
 * exit handling - the exitHandler function is called when the events are fired.
 */
function exitHandler(process, event) {
  console.warn(`Event ${event.type} received.`);

  if(event.exit) {
    console.log(`Shutting down app ...`);
    process.exit();
    }
}

// Catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, process, { exit: true, type: 'SIGINT' }));
// Catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, process, { exit: false, type: 'uncaughtException' }));