// GENERIC UPDATE LOGIC

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Dt is in units of the timer-system (i.e. milliseconds)
var g_prevUpdateDt = null;

// Du, u represents time in multiples of our nominal interval
var g_prevUpdateDu = null;

var g_isUpdateOdd = false;


// bg controls the background color
var bg = {
    r: 80,
    g: 80,
    b: 80,
    easeColour: function(du)
    {
        this.r = Math.floor(this.r + (80 - this.r) / 15 * du);
        this.g = Math.floor(this.g + (80 - this.g) / 15 * du);
        this.b = Math.floor(this.b + (80 - this.b) / 15 * du);
    },
    flash: function(r, g, b)
    {
        r = Number(r) || 255;
        g = Number(g) || 255;
        b = Number(b) || 255;
        this.r = Math.max(r, 80);
        this.g = Math.max(g, 80);
        this.b = Math.max(b, 80);
    }
};

function update(dt) {
    
    // Get out if skipping (e.g. due to pause-mode)
    if (shouldSkipUpdate()) return;

    // Remember this for later
    var original_dt = dt;
    
    // Warn about very large dt values -- they may lead to error
    if (dt > 200) {
        console.log("Big dt =", dt, ": CLAMPING TO NOMINAL");
        dt = NOMINAL_UPDATE_INTERVAL;
    }
    
    // If using variable time, divide the actual delta by the "nominal" rate,
    // giving us a conveniently scaled "du" to work with.
    var du = (dt / NOMINAL_UPDATE_INTERVAL);
    bg.easeColour(du);
    updateSimulation(du);
    
    g_prevUpdateDt = original_dt;
    g_prevUpdateDu = du;
    
    g_isUpdateOdd = !g_isUpdateOdd;
}

// Togglable Pause Mode
//
var KEY_PAUSE = 'P'.charCodeAt(0);
var KEY_STEP  = 'O'.charCodeAt(0);

var g_isUpdatePaused = false;

function shouldSkipUpdate() {
    if (g_keys.eatKey(KEY_PAUSE)) {
        g_isUpdatePaused = !g_isUpdatePaused;
    }
    return g_isUpdatePaused && !g_keys.eatKey(KEY_STEP);    
}