export const drawBoard = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
  // Circle outline
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Crosshair
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(cx - r, cy);
  ctx.lineTo(cx + r, cy);
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx, cy + r);
  ctx.stroke();
};

export const drawMark = (ctx: CanvasRenderingContext2D, tx: number, ty: number, size: number) => {
  ctx.beginPath();
  ctx.moveTo(tx - size, ty - size);
  ctx.lineTo(tx + size, ty + size);
  ctx.moveTo(tx + size, ty - size);
  ctx.lineTo(tx - size, ty + size);
  ctx.stroke();
};
