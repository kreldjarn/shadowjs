// =====
// UTILS
// =====

function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function fillCircle(ctx, x, y, r, style) {
	ctx.save();
    ctx.beginPath();
    ctx.fillStyle = style;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function fillBox(ctx, x, y, w, h, style) {
    ctx.save();
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
}