# Shellipelago

Shellipelago is a browser check-finding game for Archipelago.

This repository contains the browser game, the Shellipelago APWorld source, and build scripts for generating the bundled game files.

## Repository Layout

- `src/` contains the browser game client, map data, templates, assets, and generated client-side Archipelago data.
- `src/data/map.json` and `src/data/tileset.json` are the main map/tile inputs.
- `archipelago/world/shellipelago/` contains the APWorld Python package.
- `archipelago/data/` contains generated item/location data used by the APWorld.
- `scripts/` contains the build and packaging scripts.
- `build/` is generated output and is ignored by Git.

## How Generation Works

The build scripts read the map and tile data from `src/data/` and use it to regenerate:

- APWorld item/location data in `archipelago/data/`
- APWorld Python location data in `archipelago/world/shellipelago/locations.py`
- client lookup data in `src/archipelagoGeneratedData.js`
- `src/shellipelago.apworld`
- `build/archipelago/shellipelago.apworld`

The in-game YAML creator also uses the map data to show check counts for the selected options. The YAML options themselves are defined in the APWorld and mirrored by the browser YAML creator.

## Setup

Install Node dependencies:

```bash
npm install
```

## Common Commands

Build everything and increment the Shellipelago version:

```bash
npm run build
```

Build everything without incrementing the version:

```bash
npm run build:no-increment
```

Regenerate only the APWorld and generated Archipelago data:

```bash
npm run package:apworld
```

Package the Electron build after a full build:

```bash
npm run package:electron
```

Create release artifacts:

```bash
npm run package
```

## Updating the APWorld

After changing map data, tile data, APWorld options, items, or location generation logic, run:

```bash
npm run package:apworld
```

This updates `src/shellipelago.apworld` and the generated Archipelago/client data. Use `npm run build:no-increment` if you also want to refresh the browser build without bumping the version.

## Versioning

`npm run build` increments the displayed game version by default. Use `npm run build:no-increment` for local verification builds that should not change the version.

## Handoff Notes For Porting Web Fixes

These notes are for updating another project that was based on older Shellipelago browser/netcode.

### Constant Movement Speed

The movement speed bug was caused by gameplay movement using a render-size value:

```js
moveAmount = (...) / initialRoomView.movementTileSize
```

`movementTileSize` changed with the canvas/window short side. Shrinking the browser made each frame move more tiles, so gameplay speed changed with window size.

The fix was to make movement tile/time based instead of pixel/render-size based:

```js
var initialRoomBaseMoveTilesPerSecond = 5.046434489901609;

function initialRoomGetMovementTilesForFrame(deltaSeconds, speedMultiplier) {
  return initialRoomBaseMoveTilesPerSecond *
    (speedMultiplier || 1) *
    initialRoomGetMovementSpeedMultiplier() *
    deltaSeconds;
}
```

Normal movement, free movement, and tank movement all use this helper now. The render viewport can still scale visually, but it no longer affects gameplay speed. The old `initialRoomView.movementTileSize` field was removed so future code does not accidentally reuse the render-size path.

### Same-Slot Runtime Updates

Same-slot Archipelago updates need to be applied at runtime, not just on reconnect. The important path is:

- `RoomUpdate.checked_locations` is handled in `src/archipelagoClient.js`.
- Each checked location is routed through `archipelagoClientMarkLocationChecked()`.
- That calls `initialRoomApplyNetLocationChecked()` in `src/initialRoom.js`.
- Runtime tile/enemy state is updated immediately.

This is what makes another player on the same AP slot see opened chests, removed shop items, destroyed destructibles, killed enemy checks, and map/check status updates without rebooting.

For destructibles specifically, the same-slot color only renders while the generated destructible location is missing and the destructible is not destroyed. When the remote checked-location update arrives, the destructible runtime key is marked destroyed, so the special color disappears and the tile renders as ground.

### Browser Networking Shape

The service worker / Cloudflare Worker should be used only for room discovery and WebRTC handshake messages. Actual game data should stay peer-to-peer over WebRTC data channels.

The current Shellipelago approach avoids the older broken pattern by:

- Polling signaling messages by `room`, `role`, and `peer`.
- Sending offers, answers, and ICE candidates through mailbox-style endpoints instead of relying on broad KV listing.
- Avoiding `KV.list()` for normal room/message flow.
- Using bucketed mailbox keys so stale empty KV reads are less likely to hide newly written messages.
- Adding signal/session ids so stale ICE candidates from a previous connection attempt are ignored instead of causing `unknown ufrag`.
- Serializing signaling send/handle work so messages are processed in order.
- Waiting briefly for ICE gathering before sending offer/answer, so candidates can ride in SDP when possible.
- Keeping downloadable JSON network logs for browser-side diagnosis.

If porting to another project, copy the newer Shellipelago signaling flow from `src/shellipelagoNet.js` and the matching worker behavior from `workers/shellipelago-net-signaling-worker.js` together. Updating only one side can make handshakes fail or appear delayed.
