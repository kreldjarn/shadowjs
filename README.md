shadow.js
=========

A simple script for casting shadows from a dynamic point lightsource


#### Example
    var origin = {x: 100, y: 200};
    var rect = {
        lx: 300,
        ty: 350,
        w: 50,
        h: 200
    };
    
    // Cast a shadow of a rectangle from origin 
    Shadow.castFromRectangle(
        ctx,
        origin,
        rect.lx,
        rect.ty,
        rect.w,
        rect.h
    );


#### TODO
* Allow gradients in shadows, i.e. let them fade out instead of just exceeding the edge of the canvas.
* Implement multisampling of shadows, make the edges softer.
* Implement shadow-casting for curved forms via bezier curves.
* Implement shadow-casting for circles.
