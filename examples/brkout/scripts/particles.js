var g_explosions = [];
function particle(_x, _y, _r, _dX, _dY, _colour)
{
    // Private
    // =======
    var x = _x,
        y = _y,
        r = _r,
        // dX and dY are X and Y velocity, respectively
        dX = _dX,
        dY = _dY,
        colour = _colour,
        alpha = 0.3 + Math.random() * 0.5;
    // degrade is the magnitude by which alpha and size changes
    // each tick
    var degrade = -0.015;

    // Public
    // ======
    var res = {};
    res.update = function(growth)
    {
        x += (dX + Math.random()/10);
        y += (dY + Math.random()/10);
        alpha += degrade;
        
        // Calculate new radius
        if (growth)
            var nr = r - (degrade * 2);
        else
        {
            var nr = r + (degrade * 2);
            // Add gravity
            dY -= degrade * 10;
        }

        if (nr > 0) r = nr;
    };
    res.render = function(ctx)
    {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, false);
        ctx.fillStyle = 'rgba('+ colour +', ' + alpha + ')';
        ctx.fill();
    };
    res.getAlpha = function()
    {
        return alpha;
    };
    return res;
}


function halo(_x, _y, _colour)
{
    // Private
    // =======
    var x = _x,
        y = _y,
        colour = _colour,
        r = 200,
        pulse = 0.1,
        particles = [];

    // Public
    // ======
    res = {};
    res.spawnParticle = function()
    {
        // We randomize the velocity vector of the particles to make
        // them look more natural.
        velX = (Math.random() < 0.5) ? Math.random() : - Math.random();
        velY = (Math.random() < 0.5) ? Math.random() : - Math.random();
        particles.push(particle(x, y, Math.random()*10, velX, velY, colour));
    };
    res.update = function(_x, _y)
    {
        this.spawnParticle();
        this.spawnParticle();

        x = _x;
        y = _y;

        if (pulse > 2.5)
            pulse = 0;
        else
            pulse += 0.3;

        for (var i = 0; i < particles.length; )
        {
            particles[i].update(true);
            // We allow particles to be garbage collected when they have
            // faded almost completely
            if (particles[i].getAlpha() < 0.05)
                particles.splice(i, 1);
            else
                ++i;
        }
    };
    res.render = function(ctx)
    {
        var deltaR1 = (r + pulse) / 400;
        var deltaR2 = deltaR1 / 2;
        ctx.beginPath();
        var rad = ctx.createRadialGradient(x, y, pulse, x, y, r);
        rad.addColorStop(0, 'rgba(155, 200, 255, 0.0)');
        rad.addColorStop(0.1, 'rgba(255, 255, 255,' + deltaR1 + ')');
        rad.addColorStop(0.1, 'rgba(155, 200, 255,' + deltaR2 + ')');
        rad.addColorStop(0.8, 'rgba(155, 200, 255, 0)');
        ctx.fillStyle = rad;
        ctx.arc(x, y, r, 0, Math.PI*2, false);
        ctx.fill();
        for (var i = 0; i < particles.length; ++i)
        {
            particles[i].render(ctx);
        }
    };
    return res;
}

function brickSplosion(x, y, w, h, vX, vY, magnitude, colour)
{
    // Private
    // =======
    var particles = [];
    for (var i = 0; i < magnitude; ++i)
    {
        var cx = x + Math.random() * w,
            cy = y + Math.random() * h,
            r = 2 + Math.random() * 3,
            dX = cx - (x + w/2) + vX,
            dY = cy - (y + h/2) + vY;
        // dX, dY => box *slowly* comes apart
        particles.push(particle(cx, cy, r, dX/10, dY/10, colour));
    }

    // Public
    // ======
    var res = {};
    res.update = function()
    {
        for (var i = 0; i < particles.length; )
        {
            particles[i].update(false);
            if (particles[i].getAlpha() < 0.05)
                particles.splice(i, 1);
            else
                ++i;
        }
    };
    res.render = function(ctx)
    {
        for (var i = 0; i < particles.length; ++i)
        {
            particles[i].render(ctx);
        }
    };
    res.isOver = function()
    {
        return particles.length === 0;
    };
    return res;
}