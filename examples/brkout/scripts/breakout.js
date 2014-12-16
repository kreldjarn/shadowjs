// "Showoff Breakout"

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("workspace");
var g_ctx = g_canvas.getContext("2d");



// LEVEL

var level = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1],
    [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
    [0, 0, 0, 3, 3, 4, 4, 3, 3, 0, 0, 0],
    [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
    [1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];


var g_level = setUpLevel(level);
var TOGGLE_DEATH_KEY = 'N'.charCodeAt(0);
var g_death = true;


document.getElementById('start-level').onclick = function(e)
{
    level = document.getElementById('level-editor').value;
    level = '[' + level + ']';
    g_level = setUpLevel(JSON.parse(level));
}


// UPDATE

function updateSimulation(du) {
    if (g_keys.eatKey(TOGGLE_DEATH_KEY)) g_death = !g_death;

    if (g_level.hasWon()) 
    {
        g_ball.setIdle();
    }   

    g_ball.update(du);
    
    g_player.update(du);
    

    for (var i = 0; i < g_explosions.length;)
    {
        if (!g_explosions[i].isOver())
        {
            g_explosions[i++].update();
        }
        else
        {
            g_explosions.splice(i, 1);
        }
    }
}


// RENDER

function renderSimulation(ctx) {
    g_player.render(ctx);
    g_level.render(ctx);
    g_ball.render(ctx);
    for (var i = 0; i < g_explosions.length; ++i)
    {
        g_explosions[i].render(ctx);
    }
}

// Kick it off
g_main.init();