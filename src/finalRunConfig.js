var finalRunConfig = {
  tank: {
    fillColor: "#8f7650",
    edgeColor: "#050505",
    greyscaleFillColor: "#8f949d",
    greyscaleEdgeColor: "#050505",
    bobAmount: 0.055,
    cameraOffsetZ: 1.85,
    enemySpawnStopTime: 60000,
    skyTransition: {
      start: 55000,
      end: 60000,
      color: "#000000",
      sunStart: { x: 6, y: 5.5, z: -10 },
      sunEnd: { x: 12, y: 9, z: -18 }
    },
    sphereRoll: {
      speed: 0.46,
      rampStart: 30000,
      rampEnd: 60000,
      maxMultiplier: 1.5
    },
    chassis: {
      width: 1.35,
      height: 0.42,
      depth: 1.85,
      y: -1.52,
      z: -3.75
    },
    nozzle: {
      width: 0.24,
      height: 0.2,
      length: 2.4,
      pivotY: -1.18,
      pivotZ: -2.8,
      aimYScale: 0.5,
      maxPitchDegrees: 45,
      targetDepth: 5,
      recoilZ: 0.84,
      recoilDuration: 1000
    },
    muzzleCloud: {
      particleCount: 14,
      duration: 220,
      spread: 0.26,
      speed: 3.2,
      colors: ["#8b6a4f", "#6f7378", "#b08a62", "#4f5358"]
    },
    impactCloud: {
      particleCount: 18,
      duration: 260,
      spread: 0.34,
      speed: 2.8,
      enemyHitRadius: 48,
      dustColors: ["#8b6a4f", "#6f7378", "#b08a62", "#4f5358"],
      bloodColors: ["#b8172f", "#ef3f43", "#6b0d19"]
    },
    crosshair: {
      color: "#f7f7f1",
      greyscaleColor: "#d8d8d8",
      size: 0.16,
      gap: 0.05,
      z: -5
    },
    hp: {
      bottom: 18,
      left: 18,
      width: 260,
      height: 24
    },
    blobs: {
      firstSpawnDelay: 3000,
      minSpawnDelay: 300,
      maxSpawnDelay: 1000,
      lateMinSpawnDelay: 150,
      lateMaxSpawnDelay: 500,
      roadHalfWidth: 2.9,
      laneJitter: 0.32,
      spawnAngle: -1.15,
      spawnAngleJitter: 0.5,
      scale: 1.05,
      damage: 1,
      hitScreenY: 0.72,
      hitScreenHalfWidth: 0.18,
      minHitAge: 2200,
      maxLifetime: 18000
    },
    wizards: {
      firstSpawnDelay: 20000,
      minSpawnDelay: 8500,
      maxSpawnDelay: 14000,
      lateMinSpawnDelay: 1700,
      lateMaxSpawnDelay: 2800,
      roadHalfWidth: 2.9,
      sideOffset: 2.35,
      laneJitter: 1.1,
      spawnAngle: -1.18,
      spawnAngleJitter: 0.36,
      surfaceOffset: 4.2,
      scale: 1.15,
      minDetachAge: 800,
      maxLifetime: 17000,
      pendulumX: 0.9,
      pendulumY: 0.42,
      pendulumSpeed: 1.35,
      hitRadius: 54
    },
    fireballs: {
      interval: 5000,
      speed: 13.8,
      scale: 0.72,
      damage: 1,
      hitRadius: 0.48,
      maxLifetime: 7000
    },
    boss: {
      spawnTime: 60000,
      hp: 3,
      roadX: 0,
      spawnAngle: -1.15,
      surfaceOffset: 1.4,
      scale: 5.25,
      damage: 9999,
      hitScreenY: 0.54,
      hitScreenHalfWidth: 0.62,
      shotHitRadius: 170,
      minHitAge: 2600
    },
    credits: {
      firstSpawnDelay: 5000,
      spawnDelay: 2300,
      rollMultiplier: 0.5,
      spawnAngle: -1.12,
      spawnAngleJitter: 0.16,
      roadHalfWidth: 2.55,
      surfaceOffset: 2.65,
      fontSize: 42,
      scale: 2.2,
      finalScaleMultiplier: 2,
      shotHitRadius: 120,
      finalStopMinRollTravel: 1.25,
      stopDuration: 1000
    }
  }
};

globalsState.loadedModules.push("finalRunConfig");
