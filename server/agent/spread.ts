/**
 * SpreadPredictor Agent — Cellular Automata Fire Spread Simulation
 * Factors: wind direction/speed, terrain slope, barriers
 * SDG 13: Climate Action — physics-based spread prediction
 */

export interface WindData {
  direction_deg: number; // 0=N, 90=E, 180=S, 270=W
  speed_mps: number;
}

export interface SpreadCell {
  x: number;
  y: number;
  intensity: number; // 0-1
  timeToReach: number; // seconds
}

export interface SpreadResult {
  spread_direction: string;
  evac_window_minutes: number;
  heatmap: SpreadCell[];
  grid: number[][]; // 60x60 intensity grid
}

const GRID_SIZE = 60;
const CELL_SIZE_M = 5; // 5 meters per cell = 300m campus

// Direction labels from degrees
function degToLabel(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

// Opposite direction (where fire spreads TO)
function oppositeDir(deg: number): string {
  return degToLabel((deg + 180) % 360);
}

/**
 * Run a cellular automata fire spread for T steps.
 * Wind pushes fire in opposite direction.
 * Returns heatmap + evacuation window.
 */
export function simulateSpread(
  ignitionX: number,
  ignitionY: number,
  wind: WindData,
  terrain: number[][] | null, // elevation grid, optional
  steps: number = 20 // each step = ~1 minute
): SpreadResult {
  // Initialize grid
  const grid: number[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  const timeGrid: number[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(-1));

  // Map world coords to grid coords
  const cx = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor((ignitionX + 150) / CELL_SIZE_M)));
  const cy = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor((ignitionY + 150) / CELL_SIZE_M)));

  // Ignite origin
  grid[cx][cy] = 1.0;
  timeGrid[cx][cy] = 0;

  // Wind vector (wind blows FROM direction_deg, fire spreads OPPOSITE)
  const windRad = ((wind.direction_deg + 180) % 360) * (Math.PI / 180);
  const windDx = Math.sin(windRad) * (wind.speed_mps / 10); // normalized
  const windDy = -Math.cos(windRad) * (wind.speed_mps / 10);

  // Barrier zones (roads, open ground) — hardcoded for MRUH campus
  const barriers: Array<{ x: number; y: number; r: number }> = [
    { x: 30, y: 20, r: 3 }, // Main road
    { x: 30, y: 40, r: 3 }, // Secondary road
  ];

  function isBarrier(x: number, y: number): boolean {
    return barriers.some(b => Math.sqrt((x - b.x) ** 2 + (y - b.y) ** 2) < b.r);
  }

  // Simulate steps
  for (let t = 1; t <= steps; t++) {
    const newGrid = grid.map(row => [...row]);

    for (let x = 1; x < GRID_SIZE - 1; x++) {
      for (let y = 1; y < GRID_SIZE - 1; y++) {
        if (grid[x][y] < 0.1) continue; // Not burning
        if (isBarrier(x, y)) continue;

        // Spread to neighbors
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) continue;
            if (isBarrier(nx, ny)) continue;

            // Base spread rate
            let spreadRate = 0.15;

            // Wind factor: boost in wind direction, reduce against
            const dotProduct = dx * windDx + dy * windDy;
            spreadRate += dotProduct * 0.25;

            // Slope factor (fire spreads faster uphill)
            if (terrain) {
              const slopeBoost = ((terrain[nx]?.[ny] ?? 0) - (terrain[x]?.[y] ?? 0)) * 0.02;
              spreadRate += Math.max(0, slopeBoost);
            }

            // Diagonal penalty
            if (dx !== 0 && dy !== 0) spreadRate *= 0.7;

            // Apply
            spreadRate = Math.max(0, Math.min(1, spreadRate));
            const newIntensity = Math.min(1, newGrid[nx][ny] + grid[x][y] * spreadRate);

            if (newIntensity > newGrid[nx][ny]) {
              newGrid[nx][ny] = newIntensity;
              if (timeGrid[nx][ny] < 0) {
                timeGrid[nx][ny] = t;
              }
            }
          }
        }
      }
    }

    // Copy back
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        grid[x][y] = newGrid[x][y];
      }
    }
  }

  // Build heatmap cells (only cells with intensity > 0.05)
  const heatmap: SpreadCell[] = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (grid[x][y] > 0.05) {
        heatmap.push({
          x: x * CELL_SIZE_M - 150,
          y: y * CELL_SIZE_M - 150,
          intensity: Math.round(grid[x][y] * 100) / 100,
          timeToReach: timeGrid[x][y] >= 0 ? timeGrid[x][y] * 60 : -1, // seconds
        });
      }
    }
  }

  // Evacuation window: time until fire reaches any main corridor (y=25-35 band)
  let evacWindowSteps = steps;
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 25; y <= 35; y++) {
      if (timeGrid[x][y] > 0 && timeGrid[x][y] < evacWindowSteps) {
        evacWindowSteps = timeGrid[x][y];
      }
    }
  }

  return {
    spread_direction: oppositeDir(wind.direction_deg),
    evac_window_minutes: Math.max(1, evacWindowSteps),
    heatmap,
    grid,
  };
}
