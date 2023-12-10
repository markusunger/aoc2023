import { getInput } from '../utils/getInput';

const Pipes = ['|', '-', 'L', 'J', '7', 'F'] as const;
type Pipe = (typeof Pipes)[number];
type Coord = [number, number];
type RelativeCoord = Coord;
type Grid = Record<string, Pipe | string>;

const adjacent = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
] as const;

const neighbors: Record<Pipe, RelativeCoord[]> = {
    '|': [
        [0, -1],
        [0, 1],
    ],
    '-': [
        [-1, 0],
        [1, 0],
    ],
    L: [
        [0, -1],
        [1, 0],
    ],
    J: [
        [0, -1],
        [-1, 0],
    ],
    '7': [
        [0, 1],
        [-1, 0],
    ],
    F: [
        [0, 1],
        [1, 0],
    ],
};

function getStartingNeighbors(start: string, grid: Grid) {
    const [x, y] = start.split(',').map(Number);
    return Object.entries(neighbors).reduce((acc, [pipe, coords]) => {
        coords.forEach(([dx, dy]) => {
            const coord = `${x + dx * -1},${y + dy * -1}`;
            if (grid[coord] === pipe) {
                acc.push(coord);
            }
        });
        return acc;
    }, [] as string[]);
}

function hasConnection(coord: string, target: string, grid: Grid) {
    const [x, y] = coord.split(',').map(Number);
    const [tx, ty] = target.split(',').map(Number);

    const pipe = grid[coord];

    if (!grid[target] || !Pipes.includes(pipe as Pipe) || !Pipes.includes(grid[target] as Pipe)) {
        return false;
    }

    const coordToTarget = neighbors[pipe as Pipe].some(([dx, dy]) => {
        return x + dx === tx && y + dy === ty;
    });

    const targetToCoord = neighbors[grid[target] as Pipe].some(([dx, dy]) => {
        return tx + dx === x && ty + dy === y;
    });

    return coordToTarget && targetToCoord;
}

function drawGrid(grid: Grid) {
    const coords = Object.keys(grid).reduce((acc, coord) => {
        const [x, y] = coord.split(',').map(Number);
        acc.push([x, y]);
        return acc;
    }, [] as Coord[]);

    const minX = Math.min(...coords.map(([x]) => x));
    const maxX = Math.max(...coords.map(([x]) => x));
    const minY = Math.min(...coords.map(([, y]) => y));
    const maxY = Math.max(...coords.map(([, y]) => y));

    const lines = [];
    for (let y = minY; y <= maxY; y++) {
        let line = '';
        for (let x = minX; x <= maxX; x++) {
            const tile = grid[`${x},${y}`];
            line += tile || ' ';
        }
        lines.push(line);
    }

    console.log(lines.join('\n'));
}

function getBorderTiles(grid: Grid) {
    const coords = Object.keys(grid).reduce((acc, coord) => {
        const [x, y] = coord.split(',').map(Number);
        acc.push([x, y]);
        return acc;
    }, [] as Coord[]);

    const minX = Math.min(...coords.map(([x]) => x));
    const maxX = Math.max(...coords.map(([x]) => x));
    const minY = Math.min(...coords.map(([, y]) => y));
    const maxY = Math.max(...coords.map(([, y]) => y));

    const outside = [];

    for (let x = minX; x <= maxX; x++) {
        outside.push([x, minY]);
        outside.push([x, maxY]);
    }

    for (let y = minY; y <= maxY; y++) {
        outside.push([minX, y]);
        outside.push([maxX, y]);
    }

    return outside.map(([x, y]) => `${x},${y}`).filter((coord) => grid[coord] !== '#');
}

async function solution() {
    const input = await getInput({ test: true });

    const grid = input.reduce((acc, line, y) => {
        line.split('').forEach((tile, x) => {
            acc[`${x},${y}`] = tile;
        });
        return acc;
    }, {} as Grid);

    const startCoord = Object.entries(grid).find(([, tile]) => tile === 'S')?.[0];
    const startNeighbors = getStartingNeighbors(startCoord!, grid);
    const queue = startNeighbors;
    const visited: Record<string, number> = {
        [startCoord!]: 0,
    };

    startNeighbors.forEach((coord) => {
        visited[coord] = 1;
    });

    while (queue.length) {
        const current = queue.shift()!;

        const [x, y] = current.split(',').map(Number);

        adjacent.forEach(([dx, dy]) => {
            const coord = `${x + dx},${y + dy}`;
            if (hasConnection(current, coord, grid) && !Object.keys(visited).includes(coord)) {
                queue.push(coord);
                visited[coord] = visited[current] + 1;
            }
        });
    }

    console.log('Part 1 solution:', Math.max(...Object.values(visited)));

    // Object.keys(visited).forEach((coord) => {
    //     grid[coord] = '#';
    // });

    // drawGrid(grid);

    // const outsideBorderTiles = getBorderTiles(grid);
    // const outsideQueue = outsideBorderTiles;

    // const outsideVisited: Record<string, boolean> = {};

    // outsideBorderTiles.forEach((coord) => {
    //     outsideVisited[coord] = true;
    // });

    // while (outsideQueue.length) {
    //     const current = outsideQueue.shift()!;

    //     const [x, y] = current.split(',').map(Number);

    //     adjacent.forEach(([dx, dy]) => {
    //         const coord = `${x + dx},${y + dy}`;
    //         if (grid[coord] !== '#' && grid[coord] && !outsideVisited[coord]) {
    //             outsideQueue.push(coord);
    //             outsideVisited[coord] = true;
    //         }
    //     });
    // }

    // Object.keys(outsideVisited).forEach((coord) => {
    //     grid[coord] = 'O';
    // });

    // drawGrid(grid);

    // const insideLoopTiles = Object.entries(grid).filter(([, tile]) => tile !== 'O' && tile !== '#');

    // console.log('Part 2 solution:', insideLoopTiles?.length);
}

solution();
