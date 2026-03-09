import { ThrowSummary } from '@dartsee-assessment/shared';
import { useEffect, useRef } from 'react';
import { drawBoard, drawMark } from '../utils/canvas';

type Props = {
  throws: ThrowSummary[];
  width?: number;
  customClassName?: string;
};

const BOARD_CENTER = 400;
const BOARD_RADIUS = 300;
const CANVAS_SIZE = 800;

const ThrowMap = ({ throws, width = 500, customClassName }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const s = width / CANVAS_SIZE;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    canvas.width = width * dpr;
    canvas.height = width * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, width);

    const cx = BOARD_CENTER * s;
    const cy = BOARD_CENTER * s;
    const r = BOARD_RADIUS * s;

    drawBoard(ctx, cx, cy, r);

    // Draw throws
    const markSize = Math.max(3, 3 * s);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = Math.max(1, 1 * s);
    throws.forEach(t => drawMark(ctx, t.x * s, t.y * s, markSize));

  }, [throws, width]);

  return <canvas ref={canvasRef} width={width} height={width} style={{ width, height: width }} className={customClassName} />;
};

export default ThrowMap;
