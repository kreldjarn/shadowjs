// =========
// shadow.js
// =========
// Author: Kristján Eldjárn Hjörleifsson, kristjan@eldjarn.net


var Shadow = (function() {
    // =======
    // PRIVATE
    // =======
    var defaultScale = window.innerWidth;

    // ======
    // PUBLIC
    // ======

    var castFromRectangle = function(ctx, origin, x, y, w, h, scale) {
        // Casts a shadow of a rectangular object from a point light source
        // located at origin
        var points = [
            {x: x, y: y},
            {x: x, y: y + h},
            {x: x + w, y: y + h},
            {x: x + w, y: y}
        ];
        cast(ctx, origin, points, scale);
    };
    
    
    var cast = function(ctx, origin, points, scale) {
        // Casts a shadow of the (convex) form described by the points array
        // w.r.t. a point light source located at origin
    
        // ctx
        // ===
        // HTML5 canvas context
    
        // origin
        // ======
        // An {x, y}-object containing the coordinates of the light source.
    
        // points
        // ======
        // The array of points that make up the (convex!) form that casts the
        // shadow. The points should be in counter-clockwise order, or else the
        // shadows will be inversed (i.e. edges that are visible to the point 
        // light source will cast a shadow while those invisible to the light 
        // source will not).
    
        // scale
        // =====
        // Scales the length of the cast shadow.
        // Defaults to the width of the browser window real estate. This is 
        // probably too large for most applications, and it might increase
        // performance to use a smaller scalar. If you have a square-ish canvas
        // and want the shadow to definitely exceed the canvas (i.e. not see the
        // end of the shadow) I recommend using scale = canvas.width * 1.5
        scale = scale || defaultScale;
        
        // Check if edge is invisible from the perspective of origin
        var a = points[points.length - 1];
        for (var i = 0; i < points.length; ++i, a = b)
        {
            var b = points[i];
            var originToA = {
                x: a.x - origin.x,
                y: a.y - origin.y
            };
            var originToB = {
                x: b.x - origin.x,
                y: b.y - origin.y
            };
            var normalAtoB = {
                x: b.y - a.y,
                y: -(b.x - a.x)
            };
    
            var normalDotOriginToA = normalAtoB.x * originToA.x +
                                     normalAtoB.y * originToA.y;
    
            // If the edge is invisible from the perspective of origin it casts
            // a shadow.
            if (normalDotOriginToA < 0)
            {
                // dot(a, b) == cos(phi) * |a| * |b|
                // => cos(phi) < 0
    
                // We draw the form of the shade so that it definitely exceeds 
                // the canvas. This is probably cheaper than projecting the 
                // points onto the edges of the canvas.
                ctx.beginPath()
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(a.x + scale * originToA.x,
                           a.y + scale * originToA.y);
                ctx.lineTo(b.x + scale * originToB.x,
                           b.y + scale * originToB.y);
                ctx.lineTo(b.x, b.y);
                ctx.closePath();
                // TODO:
                // Create an option to have the fillStyle be a gradient, i.e.
                // letting the shadow fade to transparency.
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.fill();
            }
        }
    };


    var castInverse = function(ctx, origin, points, scale) {
        // Copy points and reverse in place
        var pointsReversed = points.slice(0).reverse();
        cast(ctx, origin, pointsReversed, scale);
    };

    return {
        castFromRectangle : castFromRectangle,
        cast : cast,
        castInverse : castInverse
    };
})();