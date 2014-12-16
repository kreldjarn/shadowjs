// ==========
// BALL STUFF
// ==========
var g_ball = (function()
{
    // Private
    // =======
    var loc = g_player.getLoc();
    var cx = loc.x,
        cy = loc.y,
        radius = 10,
        vel = 7,
        angle = -0.5 * Math.PI,
        trail = halo(cx, cy, '255, 255, 255'),
        isIdle = true,
        justCollided = false;
        RELEASE_KEY = 'M'.charCodeAt(0);

    var handleCollisions = function(prevX, prevY, nextX, nextY)
    {
        // Bounce off the paddle
        var collision = g_player.collidesWith(prevX, prevY, nextX, nextY, radius);
        if (!collision.miss)
        {
            angle = collision.angle;
        }
        
        // Hit roof
        if (nextY < 0)
        {
            angle *= -1;
        }
        // Hit bottom
        if (nextY > g_canvas.height)
        {
            bg.flash();
            // If 'floor is lava' is turned on we reset the ball and flash the screen
            if (g_death) setIdle();
            // If not, we bounce of the bottom
            else angle *= -1;
        }
        
        // Hit sides
        if (nextX < 0 || 
            nextX > g_canvas.width) {
            angle = Math.PI - angle;
        }

        // Collision with bricks
        // If we've just collided we are definitely hitting the *same* brick on
        // two consecutive ticks.
        if (justCollided)
        {
            justCollided = false;
            return;
        }
        var potential = g_level.getBricksAt(cx - radius,
                                            cy - radius,
                                            2 * radius,
                                            2 * radius);
        for (var i = 0; i < potential.length; ++i)
        {
            justCollided = handleCollision(potential[i], prevX, prevY, nextX, nextY);
                if (justCollided) break; // Only handle one collision per tick
        }
    };

    var handleCollision = function(pot, prevX, prevY, nextX, nextY)
    {
        var ind = pot.getInd();

        var x = g_level.getX(ind.j),
            y = g_level.getY(ind.i),
            w = g_level.getWidth(),
            h = g_level.getHeight();
        
        var r = radius;
        var prev, next;
        // East/west collisions
        if (prevX < nextX)
        {
            next = nextX + r >= x &&
                   nextY - r <= y + h &&
                   nextY + r >= y;
            prev = prevX + r >= x;
        }
        else
        {
            next = nextX - r <= x + w &&
                   nextY - r <= y + h &&
                   nextY + r >= y;
            prev = prevX + r <= x + w;

        }
        if (next && !prev)
        {
            pot.decreaseLife();
            angle = Math.PI - angle;
            return true;
        }
        
        // North/south collisions
        if (prevY < nextY)
        {
            next = nextY - r <= y &&
                   nextX + r >= x &&
                   nextX - r <= x + w;
            prev = prevY + r <= y;
        }
        else
        {
            next = nextY + r >= y + h &&
                   nextX + r >= x &&
                   nextX - r <= x + w;
            prev = prevY - r >= y + h;  
        }
        if (next && !prev)
        {
            pot.decreaseLife();
            angle *= -1;
            return true;
        }
    };

    // Public
    // ======
    var updateDispatcher = function(du)
    {
        if (g_keys.eatKey(RELEASE_KEY) && getIdle() && !g_level.hasWon())
        {
            angle = -0.75*Math.PI + 0.5*Math.random() * Math.PI;
            setActive();
        }
        if (!isIdle)
            update(du);
        else
            idle(du);
    };
    var update = function(du)
    {
        // Remember my previous position
        var prevX = cx;
        var prevY = cy;
        
        // Compute my provisional new position (barring collisions)
        var nextX = prevX + Math.cos(angle) * vel * du;
        var nextY = prevY + Math.sin(angle) * vel * du;
        
        handleCollisions(prevX, prevY, nextX, nextY);
    
        // *Actually* update my position 
        // ...using whatever velocity I've ended up with
        //
        cx += Math.cos(angle) * vel * du;
        cy += Math.sin(angle) * vel * du;
        trail.update(cx, cy);
    };

    var idle = function()
    {
        loc = g_player.getLoc();
        cx = loc.x;
        cy = loc.y - radius;
        trail.update(cx, cy);
    };


    var render = function (ctx)
    {
        fillCircle(ctx, cx, cy, radius, '#FFF');
        trail.render(ctx);
    };

    var getCenter = function()
    {
        return {x: cx, y: cy};
    };

    var getVel = function()
    {
        return {x: vel * Math.cos(angle), y: vel * Math.sin(angle)};
    };

    var setIdle = function()
    {
        isIdle = true;
    };

    var getIdle = function()
    {
        return isIdle;
    };

    var setActive = function()
    {
        isIdle = false;
    };

    var getAngle = function ()
    {
        return angle;
    };

    return {
        update    : updateDispatcher,
        render    : render,
        getCenter : getCenter,
        getVel    : getVel,
        setIdle   : setIdle,
        getIdle   : getIdle,
        setActive : setActive,
        getAngle  : getAngle
    };
})();