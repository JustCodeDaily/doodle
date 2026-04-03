import { useEffect } from "react";
import "./DrawingCanvas.css";

export default function DrawingCanvas({ canvas }) {
  const {
    canvasRef,
    tool,
    setTool,
    brushSize,
    setBrushSize,
    color,
    setColor,
    history,
    initCanvas,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    clearCanvas,
  } = canvas;

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  return (
    <div className="drawing-canvas">
      {/* ---- Toolbar Row ---- */}
      {/* Contains the tool buttons, size slider, and color picker */}
      <div className="canvas-toolbar">
        {/* Left side container groups tools and size/color to the left */}
        <div className="toolbar-left" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Left side: pen/eraser tools */}
          <div className="tool-group drawing-tools">
          {/* Pen button — active when tool === 'pen' */}
          <button
            className={`tool-btn ${tool === "pen" ? "active" : ""}`}
            onClick={() => setTool("pen")}
            title="Pen"
          >
            {/* Simple pencil icon using SVG */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>

          {/* Eraser button — active when tool === 'eraser' */}
          <button
            className={`tool-btn ${tool === "eraser" ? "active" : ""}`}
            onClick={() => setTool("eraser")}
            title="Eraser"
          >
            {/* Eraser icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
              <path d="M22 21H7" />
            </svg>
          </button>
        </div>

        {/* Middle: size slider + color picker */}
        <div className="tool-group">
          <label className="size-label">
            Size
            {/* Range input for brush thickness (1px to 40px) */}
            <input
              type="range"
              min="1"
              max="40"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="size-slider"
            />
            {/* Show current size value */}
            <span className="size-value">{brushSize}px</span>
          </label>

          {/* Color picker — only relevant for pen mode */}
          {/* HTML's native <input type="color"> gives us a color picker for free */}
          <label className="color-label">
            Color
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color-input"
            />
          </label>
        </div>
        </div>

        {/* Right side: undo + clear actions */}
        <div className="tool-group">
          {/* Undo — disabled when there's no history to undo */}
          <button
            className="action-btn"
            onClick={undo}
            disabled={history.length === 0}
            title="Undo"
          >
            ↩ Undo
          </button>

          {/* Clear — wipes the canvas (but can be undone!) */}
          <button
            className="action-btn"
            onClick={clearCanvas}
            title="Clear canvas"
          >
            ✕ Clear
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="the-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
}
