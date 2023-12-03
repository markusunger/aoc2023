import { getInput } from '../utils/getInput';
import { Grid, Part, Tiles, getAdjacentParts, hasAdjacentType } from './helpers';

async function solution() {
    const input = await getInput();

    const parts: Part[] = [];

    const grid: Grid = input.reduce((grid, line, y) => {
        // fetch parts data
        const partsMatches = line.matchAll(/\d+/g);
        for (const match of partsMatches) {
            const { index, 0: value } = match;
            parts.push({ id: Number(value), x: index as number, y, length: value.length });
        }

        // create grid data structure
        line.split('').forEach((tile, x) => {
            const tileKey = `${x},${y}`;
            const tileType = ((): Tiles => {
                if (tile === '.') return Tiles.EMPTY;
                if (tile === '*') return Tiles.GEAR;
                if (tile.match(/\d/)) return Tiles.PART;
                return Tiles.SYMBOL;
            })();
            grid[tileKey] = tileType;
        });
        return grid;
    }, {} as Grid);

    const partSum = parts.reduce((sum, part) => {
        const { x, y, length } = part;
        const partTiles = Array.from({ length }, (_, i) => `${x + i},${y}`);
        const isPart = partTiles.some((tile) =>
            hasAdjacentType(grid, tile, [Tiles.GEAR, Tiles.SYMBOL]),
        );

        return isPart ? sum + part.id : sum;
    }, 0);

    console.log('Part 1 solution:', partSum);

    const gears = Object.entries(grid).filter(([, type]) => type === Tiles.GEAR);

    const gearRatioSum = gears.reduce((sum, gear) => {
        const adjacentParts = getAdjacentParts(gear[0], parts);

        if (adjacentParts.length === 2) {
            return sum + adjacentParts[0].id * adjacentParts[1].id;
        }

        return sum;
    }, 0);

    console.log('Part 2 solution:', gearRatioSum);
}

solution();
