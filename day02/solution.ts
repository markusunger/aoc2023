import { getInput } from '../utils/getInput';

const Colors = ['red', 'green', 'blue'] as const;
type Color = (typeof Colors)[number];

type CubeDistribution = {
    [key in Color]: number;
};

const constraint: CubeDistribution = {
    red: 12,
    green: 13,
    blue: 14,
};

async function solution() {
    const input = await getInput();

    // Part 1 solution
    const idSum = input.reduce((acc, curr) => {
        const gameId = curr.match(/Game\s(\d*)/)![1];
        const gameDraws = curr.matchAll(new RegExp(`(\\d+)\\s(${Colors.join('|')})`, 'g'))!;

        for (const match of gameDraws) {
            const [, amount, color] = match as [unknown, string, Color];
            if (constraint[color] < Number(amount)) {
                return acc;
            }
        }

        return acc + Number(gameId);
    }, 0);

    console.log('Part 1 solution:', idSum);

    // Part 2 solution
    const powerSum = input.reduce((acc, curr) => {
        const draws = curr.split(';');
        const minCubes = {} as CubeDistribution;

        for (const draw of draws) {
            const cubes = draw.matchAll(new RegExp(`(\\d+)\\s(${Colors.join('|')})`, 'g'))!;
            for (const cube of cubes) {
                const [, amount, color] = cube as [unknown, string, Color];
                if (!minCubes[color] || Number(amount) > minCubes[color]) {
                    minCubes[color] = Number(amount);
                }
            }
        }

        const power = Object.values(minCubes).reduce((acc, curr) => acc * curr, 1);
        return acc + power;
    }, 0);

    console.log('Part 2 solution:', powerSum);
}

solution();
