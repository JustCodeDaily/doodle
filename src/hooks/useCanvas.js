import { useState, useEffect, useRef, useCallback } from "react";

export function useCanvas(width = 600, height = 400) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);
  const [tool, setTool] = useState("pen");
  const [brushSize, setBrushSize] = useState(3);
  const [color, setColor] = useState("#000000");
  const [history, setHistory] = useState([]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    ctxRef.current = ctx;
    setHistory([]);
  }, [width, height]);

  const getPosition = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    // Touch events store coordinates differently than mouse events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Scale factor: CSS might display the canvas at 300px
    // but the actual canvas is 600px — we need to compensate
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const startDrawing = useCallback(
    (e) => {
      e.preventDefault();
      const ctx = ctxRef.current;
      if (!ctx) return;
      saveSnapshot(); // Save canvas state for undo
      const { x, y } = getPosition(e);
      ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(x, y);
      isDrawing.current = true;
    },
    [tool, color, brushSize, getPosition, saveSnapshot],
  );

  const draw = useCallback(
    (e) => {
      e.preventDefault();
      if (!isDrawing.current) return;
      const ctx = ctxRef.current;
      if (!ctx) return;
      const { x, y } = getPosition(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    },
    [getPosition],
  );

  const stopDrawing = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.closePath();
    isDrawing.current = false;
  }, []);

  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    // getImageData copies EVERY pixel into an array
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Keep max 30 snapshots to avoid eating too much memory
    setHistory((prev) => [...prev.slice(-29), snapshot]);
  }, []);

  const undo = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const lastSnapshot = newHistory.pop();
      ctx.putImageData(lastSnapshot, 0, 0);
      return newHistory;
    });
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    saveSnapshot();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [saveSnapshot]);

  const exportAsBase64 = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    // toDataURL returns "data:image/png;base64,iVBOR..."
    // We strip the prefix — Gemini wants just the base64 part
    return canvas.toDataURL("image/png").split(",")[1];
  }, []);

  return {
    canvasRef,
    tool,
    brushSize,
    history,
    setTool,
    setBrushSize,
    setColor,
    initCanvas,
    startDrawing,
    draw,
    stopDrawing,
    saveSnapshot,
    undo,
    clearCanvas,
    exportAsBase64,
  };
}
