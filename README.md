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
