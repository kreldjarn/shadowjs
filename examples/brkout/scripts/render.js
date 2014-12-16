// GENERIC RENDERING

var g_doClear = true;
var g_doBox = false;
var g_undoBox = false;
var g_doFlipFlop = false;
var g_doRender = true;

var g_blindMode = false;

var g_frameCounter = 1;

var TOGGLE_CLEAR = 'C'.charCodeAt(0);
var TOGGLE_BLIND_MODE = 'I'.charCodeAt(0);
var TOGGLE_MARK_COLLISION_CHECK = 'M'.charCodeAt(0);

function renderVictoryMessage(ctx)
{
    ctx.save();
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'center';
    ctx.font = '40px Arial';
    ctx.fillText("Huzzah!", g_canvas.width/2, g_canvas.height/2);
    ctx.restore();
}


function render(ctx) {
    
    // Process various option toggles
    //
    if (g_keys.eatKey(TOGGLE_CLEAR)) g_doClear = !g_doClear;

    if (g_keys.eatKey(TOGGLE_BLIND_MODE)) g_blindMode = !g_blindMode;
    if (g_keys.eatKey(TOGGLE_MARK_COLLISION_CHECK))
        g_markCollisionCheck = !g_markCollisionCheck;
    
    if (g_doClear)
        fillBox(ctx, 0, 0, g_canvas.width, g_canvas.height,
                'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')');
    
    
    if (g_level.hasWon())
    {
        renderVictoryMessage(ctx);
    }
    
    if (g_doRender) renderSimulation(ctx);
    
    ++g_frameCounter;
}