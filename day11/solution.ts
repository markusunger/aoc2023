import { cloneDeep } from 'lodash';
import { getInput } from '../utils/getInput';

enum SpaceObjects {
    GALAXY = '#',
    EMPTY = '.',
}

function createPairs<T>(arr: T[]) {
    return arr.map((val, i) => arr.slice(i + 1).map((w) => [val, w])).flat();
}

function expandUniverse(universe: string[], expandFactor: number) {
    const expandedUniverse = universe.reduce((acc, line) => {
        if (!line.includes(SpaceObjects.GALAXY)) {
            for (let i = 1; i < expandFactor; i += 1) {
                acc.push(line);
            }
        }

        acc.push(line);
        return acc;
    }, [] as string[]);

    for (let i = expandedUniverse[0].length - 1; i >= 0; i -= 1) {
        const rowExpanded = cloneDeep(expandedUniverse);
        const column = expandedUniverse.map((line) => line[i]).join('');
        if (!column.includes(SpaceObjects.GALAXY)) {
            rowExpanded.forEach((line, index) => {
                expandedUniverse.splice(
                    index,
                    1,
                    line.slice(0, i) + SpaceObjects.EMPTY.repeat(expandFactor - 1) + line.slice(i),
                );
            });
        }
    }

    return expandedUniverse;
}

function getShortestPathsSum(input: string[], expandFactor: number = 1) {
    const expandedUniverse = expandUniverse(input, expandFactor);

    const grid = expandedUniverse.reduce(
        (acc, line, y) => {
            line.split('').forEach((tile, x) => {
                acc[`${x},${y}`] = tile;
            });
            return acc;
        },
        {} as Record<string, string>,
    );

    const galaxyCoords = Object.entries(grid)
        .filter(([, tile]) => tile === SpaceObjects.GALAXY)
        .map(([coord]) => coord);

    const pairs = createPairs(galaxyCoords);

    return pairs.reduce((acc, [coord1, coord2]) => {
        const distance =
            Math.abs(Number(coord1.split(',')[0]) - Number(coord2.split(',')[0])) +
            Math.abs(Number(coord1.split(',')[1]) - Number(coord2.split(',')[1]));

        return acc + distance;
    }, 0);
}

async function solution() {
    const input = await getInput();

    const shortestPathsPart1 = getShortestPathsSum(input);

    console.log('Part 1 solution:', shortestPathsPart1);

    const shortestPathsPart2 = getShortestPathsSum(input, 10);

    console.log('Part 2 solution:', shortestPathsPart2);
}

solution();
