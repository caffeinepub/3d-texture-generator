export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function buildTextureFilename(materialType: string, mapType: string): string {
  const sanitized = materialType.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${sanitized}-${mapType}.png`;
}
