const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
require("./generate-apworld-data");
const buildPaths = require("./build-paths");

const rootPath = path.resolve(__dirname, "..");
const worldName = "shellipelago";
const worldPath = path.join(rootPath, "archipelago", "world", worldName);
const sourceApworldPath = path.join(rootPath, "src", "shellipelago.apworld");
const outputPath = path.join(rootPath, "build", buildPaths.archipelagoFolderName);
const outputFilePath = path.join(outputPath, worldName + ".apworld");

function getCrcTable() {
  const table = [];

  for (let index = 0; index < 256; index += 1) {
    let crc = index;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }

    table[index] = crc >>> 0;
  }

  return table;
}

const crcTable = getCrcTable();

function getCrc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function getFiles(directoryPath, prefix = worldName) {
  return fs.readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directoryPath, entry.name);
    const archivePath = prefix + "/" + entry.name;

    if (entry.isDirectory()) {
      return getFiles(entryPath, archivePath);
    }

    return [{
      archivePath,
      content: fs.readFileSync(entryPath),
    }];
  });
}

function writeUInt16(buffer, value, offset) {
  buffer.writeUInt16LE(value, offset);
}

function writeUInt32(buffer, value, offset) {
  buffer.writeUInt32LE(value >>> 0, offset);
}

function createZip(files) {
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;

  files.forEach((file) => {
    const nameBuffer = Buffer.from(file.archivePath.replace(/\\/g, "/"), "utf8");
    const compressedContent = zlib.deflateRawSync(file.content);
    const crc = getCrc32(file.content);
    const localHeader = Buffer.alloc(30);
    const centralHeader = Buffer.alloc(46);

    writeUInt32(localHeader, 0x04034b50, 0);
    writeUInt16(localHeader, 20, 4);
    writeUInt16(localHeader, 0, 6);
    writeUInt16(localHeader, 8, 8);
    writeUInt16(localHeader, 0, 10);
    writeUInt16(localHeader, 0, 12);
    writeUInt32(localHeader, crc, 14);
    writeUInt32(localHeader, compressedContent.length, 18);
    writeUInt32(localHeader, file.content.length, 22);
    writeUInt16(localHeader, nameBuffer.length, 26);
    writeUInt16(localHeader, 0, 28);

    localParts.push(localHeader, nameBuffer, compressedContent);

    writeUInt32(centralHeader, 0x02014b50, 0);
    writeUInt16(centralHeader, 20, 4);
    writeUInt16(centralHeader, 20, 6);
    writeUInt16(centralHeader, 0, 8);
    writeUInt16(centralHeader, 8, 10);
    writeUInt16(centralHeader, 0, 12);
    writeUInt16(centralHeader, 0, 14);
    writeUInt32(centralHeader, crc, 16);
    writeUInt32(centralHeader, compressedContent.length, 20);
    writeUInt32(centralHeader, file.content.length, 24);
    writeUInt16(centralHeader, nameBuffer.length, 28);
    writeUInt16(centralHeader, 0, 30);
    writeUInt16(centralHeader, 0, 32);
    writeUInt16(centralHeader, 0, 34);
    writeUInt16(centralHeader, 0, 36);
    writeUInt32(centralHeader, 0, 38);
    writeUInt32(centralHeader, localOffset, 42);

    centralParts.push(centralHeader, nameBuffer);
    localOffset += localHeader.length + nameBuffer.length + compressedContent.length;
  });

  const centralDirectory = Buffer.concat(centralParts);
  const localDirectory = Buffer.concat(localParts);
  const endHeader = Buffer.alloc(22);

  writeUInt32(endHeader, 0x06054b50, 0);
  writeUInt16(endHeader, 0, 4);
  writeUInt16(endHeader, 0, 6);
  writeUInt16(endHeader, files.length, 8);
  writeUInt16(endHeader, files.length, 10);
  writeUInt32(endHeader, centralDirectory.length, 12);
  writeUInt32(endHeader, localDirectory.length, 16);
  writeUInt16(endHeader, 0, 20);

  return Buffer.concat([localDirectory, centralDirectory, endHeader]);
}

if (!fs.existsSync(worldPath)) {
  throw new Error("Missing world folder: " + worldPath);
}

fs.mkdirSync(outputPath, { recursive: true });
const apworldContent = createZip(getFiles(worldPath));

fs.writeFileSync(outputFilePath, apworldContent);
fs.writeFileSync(sourceApworldPath, apworldContent);

console.log("Packaged " + path.relative(rootPath, outputFilePath));
