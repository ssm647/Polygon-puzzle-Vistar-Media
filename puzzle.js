var http     = require('http');
var express  = require('express');
var parser   = require('body-parser');

var app = express();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 8888);

//Load states.json in the dictionary
var stateBoundaries = require("./states.json");

app.post('/', function (req,res,next) {
    res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    console.log(req.body.lat+ ", "+req.body.long);

    //Getting the Latitude and Longitude from the user
    var lat =  req.body.lat;
    var long = req.body.long;
    var found = false;
    var point = [long, lat]; 
    //Looping each state to find if the point lies in the state
    for(i in stateBoundaries.states){
        var stateData = (stateBoundaries.states[i]);
        var boundaries = stateData.border;
        var size = boundaries.length; 
        //Passing the boundaries of the current state, number of boundries of current state, 
        //and the point that we have to check if lies in the state or not to the function pointInPolygon()
        if(pointInPolygon(boundaries, size, point)){
            found = true
            console.log(stateData.state);       
            res.status(200).send(JSON.stringify(stateData.state));
            break;
        } 
    }
    if(found === false){
        res.status(200).send(JSON.stringify(""));
    }
});

function inbetween(p, q, r)
{
    //this checks if the point lies in between the two vertices of the state incase the point and the state edge are COLLINEAR
    //If not that means the point is outside the state
    if (q[0] <= Math.max(p[0], r[0]) && q[0] >= Math.min(p[0], r[0]) &&
            q[1] <= Math.max(p[1], r[1]) && q[1] >= Math.min(p[1], r[1]))
        return true;
    return false;
}

function position(p, q,r)
{
    var value = (q[1] - p[1]) * (r[0] - q[0]) -
              (q[0] - p[0]) * (r[1] - q[1]);
    
    //if value is 0 that means that the orientation of the point p, q, r are in line
    if (value === 0) 
      return 0; 
    //if value is 1 that means that the point lies on the left side of the two vertices of the state
    //if value is 2 that means that the point lies on the right side of the two vertices of the state
    return (value > 0)? 1: 2; 
}

function checkintersect(p1, q1, p2, q2)
{

    //Check the orientation of the points 
    var ort1 = position(p1, q1, p2);
    var ort2 = position(p1, q1, q2);
    var ort3 = position(p2, q2, p1);
    var ort4 = position(p2, q2, q1);

    // If this condition satifies then the vertices of the states and the lines formed by point & extreme intersect
    if (ort1 != ort2 && ort3 != ort4)
        return true;

    //0 means that the point and the two state vertices are in the same line (COLLINEAR). 
    // Now inbetween() checks if the point lies in between the two vertices of the current state if they are COLLINEAR
    if (ort1 === 0 && inbetween(p1, p2, q1)) 
        return true;
    if (ort2 === 0 && inbetween(p1, q2, q1)) 
        return true;
    if (ort3 === 0 && inbetween(p2, p1, q2)) 
        return true;
    if (ort4 === 0 && inbetween(p2, q1, q2)) 
        return true;
    
    return false; 
}


function pointInPolygon(boundaries, size, point)
{
    //Check the size. If it is less than three then three is not point in checking futher. State cannot be a line. 
    if (size < 3)  
        return false;

    //Draw the point from current location to the extreme right so to check the state edges it is crossing
    var extreme = [Number.MAX_VALUE, point[1]];
    var count = 0;
    var i = 0;
    //for each two vertices of the state check if the line formed by the point and the extreme
    //is crossing the two vertices of the states 
    do
    {
        var next = (i+1)%size;

        //Passing the two boundries that forms the edges line of the state, 
        //point to be check and the extreme point that are forming another line to the function checkintersect()
        if (checkintersect(boundaries[i], boundaries[next], point, extreme))
        {
          //check if the point are in the same line
          if (position(boundaries[i], point, boundaries[next]) === 0){
             //if they are in the same line check if the point lies between the two vertices of the state
             return inbetween(boundaries[i], point, boundaries[next]);
         }
          count++;
        }
        i = next;
    } while (i !== 0);
    //The point to the extreme line is crossing odd number of vertices or even? 
    return count%2 === 1;
}

//Creates the server 
http.createServer(app).listen(app.get('port'), function(){
    console.log('Server listening to the port ' + app.get('port'));
});


