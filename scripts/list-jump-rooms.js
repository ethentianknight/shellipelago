const fs = require("fs");
const path = require("path");

const mapPath = path.resolve(process.argv[2] || path.join(__dirname, "..", "src", "data", "map.json"));
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const jumpPattern = /^jump([senw])$/i;

function collectJumpDirections(value, directions) {
  if (typeof value === "string") {
    const match = value.match(jumpPattern);

    if (match) {
      directions.add(match[1].toUpperCase());
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => collectJumpDirections(entry, directions));
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((entry) => collectJumpDirections(entry, directions));
  }
}

const rooms = (map.rooms || []).map((room) => {
  const directions = new Set();

  collectJumpDirections(room.tiles || [], directions);
  return {
    name: room.name || room.id || "Unnamed room",
    x: Number(room.x) || 0,
    y: Number(room.y) || 0,
    directions: ["N", "E", "S", "W"].filter((direction) => directions.has(direction)),
  };
}).filter((room) => room.directions.length);

rooms.sort((left, right) => left.y - right.y || left.x - right.x || left.name.localeCompare(right.name));

console.log(`Jump rooms: ${rooms.length}`);
rooms.forEach((room) => {
  console.log(`${room.x},${room.y} | ${room.name} | Jump${room.directions.join("/Jump")}`);
});
