const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const router = require( './routes/routing' );
const myErrorLogger = require( './utilities/errorlogger' );
const myRequestLogger = require( './utilities/requestlogger' );
const cors = require( 'cors' );
const app = express();

app.use( cors() );
app.use( bodyParser.json() );

app.use( myRequestLogger );
app.use( '/', router );
app.use( myErrorLogger );


app.listen( 1150 );
console.log( "Server listening in port 1150" );


module.exports = app;