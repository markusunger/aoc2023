import { getInput } from '../utils/getInput';

function getNewCoord(
    [x, y]: [number, number],
    direction: string,
    distance: number,
): [number, number] {
    switch (direction) {
        case 'U':
            return [x, y - distance];
        case 'D':
            return [x, y + distance];
        case 'L':
            return [x - distance, y];
        case 'R':
            return [x + distance, y];
        default:
            throw new Error(`Unknown direction: ${direction}`);
    }
}

async function solution(part2 = false) {
    let input = await getInput();

    if (part2) {
        input = input.map((line) => {
            const matches = Array.from(line.matchAll(/#([0-9a-f]{5})([0-9a-f]{1})/g))[0];
            const [, dist, direction] = matches;
            return `${['R', 'D', 'L', 'U'][Number(direction)]} ${parseInt(dist, 16)}`;
        });
    }

    const vertices = new Set<[number, number]>();
    input.reduce(
        (coord, instruction) => {
            vertices.add(coord);
            const [direction, distance] = instruction.split(' ');
            return getNewCoord(coord, direction, Number(distance));
        },
        [0, 0] as [number, number],
    );

    const verticesArray = Array.from(vertices.values());

    const trapezoid = verticesArray.reduce((sum, [x, y], i) => {
        const [x1, y1] = verticesArray[i + 1] ? verticesArray[i + 1] : verticesArray[0];
        const area = (y + y1) * (x - x1);
        return sum + area / 2;
    }, 0);

    const pathLength = verticesArray.reduce((sum, [x, y], i) => {
        const [x1, y1] = verticesArray[i + 1] ? verticesArray[i + 1] : verticesArray[0];
        return sum + Math.abs(x - x1) + Math.abs(y - y1);
    }, 0);

    console.log(`Part ${part2 ? '2' : '1'} solution: ${trapezoid + pathLength / 2 + 1}`);
}

solution().then(() => solution(true));
