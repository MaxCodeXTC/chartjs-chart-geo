import { Chart } from '../chart';
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

/**
 *
 * @param {HTMLCanvasElement} canvas
 */
function toBuffer(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((b) => {
      const file = new FileReader();
      file.onload = () => resolve(Buffer.from(file.result));
      file.readAsArrayBuffer(b);
    });
  });
}

export default function createChart(config, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = options.width || 800;
  canvas.height = options.height || 600;
  config.options = Object.assign(
    {
      responsive: false,
      animation: false,
      fontFamily: "'Arial', sans-serif",
    },
    config.options || {}
  );
  const ctx = canvas.getContext('2d');

  // sync
  Chart.helpers.requestAnimFrame = (c) => c();

  const t = new Chart(ctx, config);

  return {
    chart: t,
    canvas,
    ctx,
    toMatchImageSnapshot(options) {
      return toBuffer(canvas).then((image) => expect(image).toMatchImageSnapshot(options));
    },
  };
}