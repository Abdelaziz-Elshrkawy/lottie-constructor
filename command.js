#!/usr/bin/env node
const { Command } = require('commander');
const { existsSync } = require('fs');
const path = require('path');
const { generateLottieJSON } = require('./lottieConstructor');



const program = new Command();


program
    .version('1.0.0')
    .description('Convert PNG frames to Lottie JSON format')
    .option('-i, --input <dir>', 'Input directory containing PNG frames', './')
    .option('-o, --output <file>', 'Output Lottie JSON file', 'output.json')
    .option('-f, --framerate <rate>', 'Frame rate of the animation', '24');

program.parse(process.argv);

const { input, output, framerate } = program.opts();

if (!existsSync(path.join(__dirname, input))) {
    console.error('Error: path is not valid or directory doesn\'t exists')
} else {
    generateLottieJSON(input, output, framerate).catch(e => console.error(e));
}


