function setUpLevel(levelTemplate)
{
    var MAX_BRICKS_ROW = 12,
        MAX_BRICKS_COL = 7,
        OFFSET = 60;

    var BRICK_MARGIN = 15,
        BRICK_WIDTH = ((g_canvas.width - (2 * OFFSET)) / MAX_BRICKS_ROW) - BRICK_MARGIN,
        BRICK_HEIGHT = BRICK_WIDTH;

    var colour = ['255, 55, 100',
                  '255, 55, 255',
                  '55, 255, 255',
                  '255, 155, 55',
                  '55, 255, 155',
                  '55, 155, 255'];

    var indestructible_color = '255, 255, 255'

    g_ball.setIdle();

    var level = (function()
    {
        // Private
        // =======
        var bricks = [];
        // We keep score of the total life for the victory conditions, rather
        // than checking all bricks, each tick.
        var totalLife = 0;
        for (var i = 0; i < levelTemplate.length; ++i, bricks.push([]));

        // Public
        // ======
        var getX = function(j)
        {
            return OFFSET + ((BRICK_HEIGHT + BRICK_MARGIN) * j);
        };
        var getY = function(i)
        {
            return OFFSET + ((BRICK_WIDTH + BRICK_MARGIN) * i);
        };
        var getWidth = function(i, j)
        {
            return BRICK_WIDTH;
        };
        var getHeight = function(i, j)
        {
            return BRICK_HEIGHT;
        };

        var setBrick = function(i, j, brick)
        {
            bricks[i][j] = brick;
        };
        var getBrick = function(i, j)
        {
            var tmp = bricks[i];
            if (!tmp) return null;
            tmp = tmp[j];
            if (tmp && tmp.getLife()) return tmp;
            return null;
        };
        // Takes a rectangle as an argument and returns an array of bricks that
        // are close to it.
        var getBricksAt = function(x, y, w, h)
        {
            // We presume that the input rectangle is smaller than or equal to
            // this size of a brick. Therefore, we can at most return 4 bricks
            // that overlap the rectangle.
            var nj = Math.floor((x + w/2 - OFFSET) / (BRICK_WIDTH + BRICK_MARGIN)),
                ni = Math.floor((y + h/2 - OFFSET) / (BRICK_HEIGHT + BRICK_MARGIN));

            var potential = [
                getBrick(ni, nj),
                getBrick(ni + 1, nj),
                getBrick(ni, nj + 1),
                getBrick(ni + 1, nj + 1)
            ];
            for (var i = 0; i < potential.length; )
            {
                if (potential[i]) ++i;
                else potential.splice(i, 1);
            }
            
            return potential;
        };

        var addToLife = function(i)
        {
            totalLife += i;
        };

        var hasWon = function()
        {
            return totalLife === 0;
        }

        var render = function(ctx)
        {
            if (!g_blindMode)
            {
                // Render bricks
                for (var i = 0; i < bricks.length; ++i)
                {
                    var yOffset = getY(i);
                    for (var j = 0; j < bricks[i].length; ++j)
                    {
                        var xOffset = getX(j);
                        bricks[i][j].render(ctx, xOffset, yOffset);
                    }
                }
            }
            // Render shadows on top of the bricks
            for (var i = 0; i < bricks.length; ++i)
            {
                var yOffset = getY(i);
                for (var j = 0; j < bricks[i].length; ++j)
                {
                    var xOffset = getX(j);
                    if (bricks[i][j].getLife())
                    {
                        Shadow.castFromRectangle(
                            ctx,
                            g_ball.getCenter(),
                            xOffset,
                            yOffset,
                            BRICK_WIDTH,
                            BRICK_HEIGHT
                        );
                    }
                }
            }
        };

        return {
            setBrick    : setBrick,
            getBrick    : getBrick,
            getBricksAt : getBricksAt,
            getX        : getX,
            getY        : getY,
            getWidth    : getWidth,
            getHeight   : getHeight,
            render      : render,
            addToLife   : addToLife,
            hasWon      : hasWon
        };
    })();

    // We populate the wall with bricks as denoted by levelTemplate
    for (var i = 0; i < levelTemplate.length && i < MAX_BRICKS_COL; ++i)
    {
        for (var j = 0; j < levelTemplate[i].length && j < MAX_BRICKS_ROW; ++j)
        {
            level.setBrick(i, j, (function()
            {
                // Bricks don't have an absolute position. The wall handles those

                // Private
                // =======
                var type = levelTemplate[i][j],
                    life = (type < colour.length) ? type : -1, // Indestructible
                    indestructible = life === -1,
                    _i = i,
                    _j = j;
                    if (!indestructible)
                        level.addToLife(life);
                
                // Public
                // ======
                var render = function(ctx, x, y)
                {
                    //console.log('x: ' + x + ', y: ' + y);
                    if (life)
                    {
                        if (!indestructible)
                        {
                            var c_index = (life >= colour.length) ?
                                           colour.length - 1 : life - 1;
                            var c = colour[c_index];
                        }
                        else
                        {
                            var c = indestructible_color;
                        }
                        fillBox(ctx, x, y, BRICK_WIDTH, BRICK_HEIGHT,
                                'rgba(' + c + ',255)');
                    }
                    
                };
                var decreaseLife = function()
                {
                    if (life && !indestructible)
                    {
                        var col = colour[life - 1].split(', ');
                        bg.flash(col[0], col[1], col[2]);
                        life--;
                        level.addToLife(-1);
                        var magnitude = 50;
                        var i = getInd();
                        var vel = g_ball.getVel();
                        g_explosions.push(brickSplosion(g_level.getX(i.j),
                                                        g_level.getY(i.i),
                                                        BRICK_WIDTH,
                                                        BRICK_HEIGHT,
                                                        vel.x,
                                                        vel.y,
                                                        magnitude,
                                                        colour[life]));
                    }

                };
                var getLife = function()
                {
                    return life;
                };
                var getInd = function()
                {
                    return {i: _i, j: _j};
                };

                return {
                    render       : render,
                    decreaseLife : decreaseLife,
                    getLife      : getLife,
                    getInd       : getInd
                };
            })());
        }
    }
    return level;

}