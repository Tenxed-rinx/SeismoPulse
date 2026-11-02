/**
 * Utility to export SVG charts as high-resolution PNG or vector SVG files
 * for academic reports, documentation, and presentations.
 */

export function exportSvgAsSvg(svgElementId: string, filename: string) {
  const svg = document.getElementById(svgElementId);
  if (!svg) return;

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  // Add name spaces if not present
  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  // Prepend XML declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${filename}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

export function exportSvgAsPng(svgElementId: string, filename: string, title?: string) {
  const svg = document.getElementById(svgElementId) as SVGSVGElement | null;
  if (!svg) return;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const URLObj = window.URL || window.webkitURL || window;
  const blobURL = URLObj.createObjectURL(svgBlob);

  const image = new Image();
  image.onload = () => {
    // 2x resolution for retina / print quality
    const scale = 2;
    const canvas = document.createElement('canvas');
    const width = (svg.clientWidth || 800) * scale;
    const height = (svg.clientHeight || 450) * scale + (title ? 60 * scale : 0);
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white background for document insertion
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Optional Academic Title Header
    let yOffset = 0;
    if (title) {
      yOffset = 50 * scale;
      ctx.fillStyle = '#0F172A';
      ctx.font = `bold ${16 * scale}px "Plus Jakarta Sans", "Roboto", sans-serif`;
      ctx.fillText(title, 20 * scale, 30 * scale);

      ctx.fillStyle = '#64748B';
      ctx.font = `${11 * scale}px "Roboto Mono", monospace`;
      ctx.fillText('SeismoPulse Studio — Big Data Management (BDM) Analytics', 20 * scale, 45 * scale);
    }

    ctx.drawImage(image, 0, yOffset, width, height - yOffset);

    const pngURL = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngURL;
    downloadLink.download = `${filename}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URLObj.revokeObjectURL(blobURL);
  };

  image.src = blobURL;
}
