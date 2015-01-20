var KEY_A = 'A'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);
var KEY_LT = 37
var KEY_RT = 39
var g_player = player(40, 570, KEY_LT, KEY_RT);

function player(_cx, _cy, _GO_LEFT, _GO_RIGHT)
{
    // Private
    // =======
    var cx = _cx,
        cy = _cy,
        GO_LEFT = _GO_LEFT,
        GO_RIGHT = _GO_RIGHT;

    var halfWidth = 40,
        halfHeight = 5,
        easeModifier = 15,
        targetX = cx;

    // Public
    // ======
    var res = {};
    res.update = function (du) {
        cx += (targetX - cx) / easeModifier * du;
        
        // Bounce off the sides
        if (cx - halfWidth < 0)
        {
            if (targetX < halfWidth)
                targetX = halfWidth + Math.abs(targetX);
        }
        else if (cx + halfWidth > g_canvas.width)
        {
            
            if (targetX + halfWidth > g_canvas.width)
                targetX = 2 * g_canvas.width - 2 * halfWidth - targetX;
        }
    
        
        if (g_keys.getState(GO_LEFT))
            targetX -= 11 * du;
        if (g_keys.getState(GO_RIGHT))
            targetX += 11 * du;
    };

    res.render = function (ctx) {
        Shadow.castFromRectangle(
            ctx,
            g_ball.getCenter(),
            cx - halfWidth,
            cy - halfHeight,
            halfWidth * 2,
            halfHeight * 2
        );
        if (!g_blindMode)
        {
            ctx.save();
            ctx.fillStyle = '#FFF';
            ctx.fillRect(cx - halfWidth,
                         cy - halfHeight,
                         halfWidth * 2,
                         halfHeight * 2);
            ctx.restore();
        }
    };

    res.getLoc = function()
    {
        return {x: cx, y: cy};
    }

    res.collidesWith = function(prevX, prevY, 
                                nextX, nextY, 
                                r)
    {
        // We check for collisions with the top and bottom of the paddle:
        var right = cx + halfWidth,
            left = cx - halfWidth;
        var playerEdge = cy;
        // Check Y coords
        if ((nextY - r < playerEdge && prevY - r >= playerEdge) ||
            (nextY + r > playerEdge && prevY + r <= playerEdge)) {
            // Check X coords
            if (nextX + r >= left &&
                nextX - r <= right) {
                // New angle of the ball depends on its orientation wrt the player
                var deltaX = nextX - cx;
                var deltaY = nextY - cy;
                // Collisions with the ball push the Player object in the opposite
                // direction to that of the ball. The ball is twice as heavy as
                // the paddle
                targetX -= deltaX * 2;
                return {angle: Math.atan2(deltaY, deltaX)};
            }
        }
        // We check for collisions with the sides of the paddle:
        if (nextX - r < right && prevX - r >= right ||
            nextX + r > left && prevX + r <= left)
        {
            if (nextY + r >= cy - halfHeight &&
                nextY - r <= cy - halfHeight)
            {
                // Extra kick if we're hitting the paddle on the side
                targetX += g_ball.getVel().x * 20;
                // If side collision, we send the ball in the direction
                // from whence it came
                return {angle: Math.PI + g_ball.getAngle()};
            }
        }
        // It's a miss!
        return {miss: true};
    };

    return res;
}