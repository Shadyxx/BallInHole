window.onload = init;


var winW, winH;
var ball;
var mouseDownInsideball;
var touchDownInsideball;
var movementTimer;
var lastMouse, lastOrientation, lastTouch;
var xRandom = Math.floor((Math.random()*1400)+30);
var yRandom = Math.floor((Math.random()*600)+30);
//chrono
var startTime = 0
var start = 0
var end = 0
var diff = 0
var timerID = 0
var playTime = 0;

                            
// Initialisation on opening of the window
function init()
{
        lastOrientation = {};
        window.addEventListener('resize', doLayout, false);
        document.body.addEventListener('mousemove', onMouseMove, false);
        document.body.addEventListener('mousedown', onMouseDown, false);
        document.body.addEventListener('mouseup', onMouseUp, false);
        document.body.addEventListener('touchmove', onTouchMove, false);
        document.body.addEventListener('touchstart', onTouchDown, false);
        document.body.addEventListener('touchend', onTouchUp, false);
        window.addEventListener('deviceorientation', deviceOrientationTest, false);
        lastMouse = {x:0, y:0};
        lastTouch = {x:0, y:0};
        mouseDownInsideball = false;
        touchDownInsideball = false;    
        doLayout(document);        
}

// Does the gyroscope or accelerometer actually work?
function deviceOrientationTest(event) 
{
        window.removeEventListener('deviceorientation', deviceOrientationTest);
        if (event.beta != null && event.gamma != null) 
		{
            window.addEventListener('deviceorientation', onDeviceOrientationChange, false);
            movementTimer = setInterval(onRenderUpdate, 10); 
        }
}

function doLayout(event) 
{
        winW = window.innerWidth;
        winH = window.innerHeight;
        var surface = document.getElementById('surface');
        surface.width = winW;
        surface.height = winH;
        var radius = surface.width/50;
        ball = {  	radius:radius,
					x:Math.round(winW/2),
                    y:Math.round(winH/2),
                    color:'rgba(51, 102, 153, 255)'};    
                                
        renderBall();      
        drawHole();
}

function onRenderUpdate(event) 
{
        var xDelta, yDelta;
        switch (window.orientation) 
		{
                case 0: // portrait - normal
                        xDelta = lastOrientation.gamma;
                        yDelta = lastOrientation.beta;
                        break;
                case 180: // portrait - upside down
                        xDelta = lastOrientation.gamma * -1;
                        yDelta = lastOrientation.beta * -1;
                        break;
                case 90: // landscape - bottom right
                        xDelta = lastOrientation.beta;
                        yDelta = lastOrientation.gamma * -1;
                        break;
                case -90: // landscape - bottom left
                        xDelta = lastOrientation.beta * -1;
                        yDelta = lastOrientation.gamma;
                        break;
                default:
                        xDelta = lastOrientation.gamma;
                        yDelta = lastOrientation.beta;
        }
        moveBall(xDelta, yDelta);
        
}

function moveBall(xDelta, yDelta) 
{        
	if (playTime == 1)
	{
		ball.x += xDelta;
		ball.y += yDelta;
		renderBall();
		if (ball.x > xRandom-1 && ball.x < xRandom+1 && ball.y > yRandom-1 && ball.y < yRandom+1)
		{                			                
			alert("You won!");
			document.getElementById('reset').onclick();	
		}
	}		        
}

function onMouseMove(event) 
{     
	if(mouseDownInsideball)
	{
        var xDelta, yDelta;
        xDelta = event.clientX - lastMouse.x;
        yDelta = event.clientY - lastMouse.y;
        moveBall(xDelta, yDelta);
        lastMouse.x = event.clientX;
        lastMouse.y = event.clientY;
    }
}

function onMouseDown(event) 
{
        var x = event.clientX;
        var y = event.clientY;
        if(     x > ball.x - ball.radius &&
                x < ball.x + ball.radius &&
                y > ball.y - ball.radius &&
                y < ball.y + ball.radius){
                mouseDownInsideball = true;
                lastMouse.x = x;
                lastMouse.y = y;
        } 
		else 
		{
                mouseDownInsideball = false;
        }
} 

function onMouseUp(event) 
{
        mouseDownInsideball = false;
}

function onTouchMove(event) 
{
        event.preventDefault();        
        if(touchDownInsideball)
		{
            var touches = event.changedTouches;
            var xav = 0;
            var yav = 0;
            for (var i=0; i < touches.length; i++) 
			{
                var x = touches[i].pageX;
                var y = touches[i].pageY;
                xav += x;
                 yav += y;
            }
            xav /= touches.length;
            yav /= touches.length;
            var xDelta, yDelta;

            xDelta = xav - lastTouch.x;
            yDelta = yav - lastTouch.y;
            moveBall(xDelta, yDelta);
            lastTouch.x = xav;
            lastTouch.y = yav;
        }
}

function onTouchDown(event) 
{
        event.preventDefault();
        touchDownInsideball = false;
        var touches = event.changedTouches;
        for (var i=0; i < touches.length && !touchDownInsideball; i++) 
		{
                var x = touches[i].pageX;
                var y = touches[i].pageY;
                if(        x > ball.x - ball.radius &&
                        x < ball.x + ball.radius &&
                        y > ball.y - ball.radius &&
                        y < ball.y + ball.radius){
                        touchDownInsideball = true;                
                        lastTouch.x = x;
                        lastTouch.y = y;                        
                }
        }
} 

function onTouchUp(event)
{
        touchDownInsideball = false;
}

function onDeviceOrientationChange(event) 
{
        lastOrientation.gamma = event.gamma;
        lastOrientation.beta = event.beta;
}

function renderBall() 
{
        var surface = document.getElementById('surface');
        var context = surface.getContext('2d');
        context.clearRect(0, 0, surface.width, surface.height);     
        drawHole();      
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
        context.fillStyle = ball.color;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = ball.color;
        context.stroke();      
} 

function drawHole()
{
	var context = surface.getContext('2d');   
	var radius = surface.width/45;
    context.beginPath();
    context.arc(xRandom, yRandom, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'black';
    context.fill();
    context.lineWidth = 6;
    context.strokeStyle = 'orange';
    context.stroke();
          
} 

function inHole(xDelta, yDelta)
{
        if (ball.x > xRandom-1 && ball.x < xRandom+1 && ball.y > yRandom-1 && ball.y < yRandom+1)
		{                         
                alert("Je hebt het spelletje uitgespeeld op " + document.getElementById('showtm').innerHTML + " seconden !");
				xRandom = Math.floor((Math.random()*1650)+60);
				yRandom = Math.floor((Math.random()*800)+60);
				drawHole();
				init(); 
                doReset();                                
        }
}

function chrono(){
	end = new Date()
	diff = end - start
	diff = new Date(diff)
	var msec = diff.getMilliseconds()
	var sec = diff.getSeconds()
	var min = diff.getMinutes()
	var hr = diff.getHours()-1
	if (min < 10){
		min = "0" + min
	}
	if (sec < 10){
		sec = "0" + sec
	}
	if(msec < 10){
		msec = "00" +msec
	}
	else if(msec < 100){
		msec = "0" +msec
	}
	document.getElementById("chronotime").innerHTML = hr + ":" + min + ":" + sec + ":" + msec
	timerID = setTimeout("chrono()", 10)
}

function chronoStart(){
	playTime = 1;
	document.chronoForm.startstop.value = "Stop"
	document.chronoForm.startstop.onclick = chronoStop
	start = new Date()
	chrono()
}
function chronoContinue(){
	playTime = 1;
	document.chronoForm.startstop.value = "Stop"
	document.chronoForm.startstop.onclick = chronoStop
	start = new Date()-diff
	start = new Date(start)
	chrono()
}
function chronoStop(){
	playTime = 0;
	document.chronoForm.startstop.value = "Start"
	document.chronoForm.startstop.onclick = chronoContinue
	clearTimeout(timerID)
}



