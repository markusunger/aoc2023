export enum Tiles {
    EMPTY = 'empty',
    PART = 'part',
    SYMBOL = 'symbol',
    GEAR = 'gear',
}

export type Grid = Record<string, Tiles>;
export type Part = {
    id: number;
    x: number;
    y: number;
    length: number;
};

export function getAdjacentCoords(coord: string): string[] {
    const [x, y] = coord.split(',').map(Number);
    return [
        `${x},${y - 1}`,
        `${x},${y + 1}`,
        `${x - 1},${y}`,
        `${x + 1},${y}`,
        `${x - 1},${y - 1}`,
        `${x + 1},${y - 1}`,
        `${x - 1},${y + 1}`,
        `${x + 1},${y + 1}`,
    ];
}

export function hasAdjacentType(grid: Grid, coord: string, types: Tiles[]): boolean {
    const adjacentCoords = getAdjacentCoords(coord);
    return adjacentCoords.some((coord) => types.some((type) => grid[coord] === type));
}

export function getAdjacentParts(coord: string, parts: Part[]): Part[] {
    const adjacentCoords = getAdjacentCoords(coord);
    return parts.filter((part) => {
        const { x, y, length } = part;
        const partTiles = Array.from({ length }, (_, i) => `${x + i},${y}`);
        return partTiles.some((tile) => adjacentCoords.includes(tile));
    });
}
