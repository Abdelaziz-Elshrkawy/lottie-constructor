const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function generateLottieJSON(inputDir,outputFile,frameRate) {
  const files = await fs.readdir(inputDir);
  const pngFiles = files.filter(file => file.endsWith('.png')).sort();

  if (pngFiles.length === 0) {
    console.log('No PNG files found in the directory.');
    return;
  }

  const firstImage = await loadImage(path.join(inputDir, pngFiles[0]));
  const width = firstImage.width;
  const height = firstImage.height;

  const lottieData = {
    v: "5.6.10",
    fr: frameRate,
    ip: '0',
    op: pngFiles.length,
    w: `${width}`,
    h: `${height}`,
    nm: "PNG Animation",
    ddd: '0',
    assets: [],
    layers: []
  };

  const processFrames = pngFiles.map(async (file, index) => {
    const img = await loadImage(path.join(inputDir, file));
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    if(index === 0) console.log(`Processing Frames :)`);

    lottieData.assets.push({
      id: `fr_${index}`,
      w: `${width}`,
      h: `${height}`,
      u: "",
      p: canvas.toDataURL()
    });

    lottieData.layers.push({
      ddd: 0,
      ind: index + 1, 
      ty: 2,
      nm: `fr_${index}`,
      cl: path.extname(file).slice(1),
      refId: `fr_${index}`,
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [width / 2, height / 2, 0], ix: 2 },
        a: { a: 0, k: [width / 2, height / 2, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      ip: index,
      op: index + 1,
      st: 0,
      bm: 0
    });
  });

  await Promise.all(processFrames);

  // Write JSON file
  await fs.writeFile(outputFile, JSON.stringify(lottieData, null, 2));
  console.log(`Lottie JSON file created: ${outputFile}`);
}

module.exports = {
  generateLottieJSON
}
