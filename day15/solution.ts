import { getInput } from '../utils/getInput';

interface Lens {
    label: string;
    focalLength: number;
}

function getHash(step: string): number {
    const chars = step.split('');
    return chars.reduce((hash, char) => {
        const initial = hash + char.charCodeAt(0);
        const multiplied = initial * 17;
        return multiplied % 256;
    }, 0);
}

async function solution() {
    const input = await getInput({ splitOn: ',' });

    const hashSum = input.reduce((sum, step) => {
        const hash = getHash(step);
        return sum + hash;
    }, 0);

    console.log('Part 1 solution:', hashSum);

    const hashMap = new Map<number, Lens[]>(Array.from({ length: 256 }).map((_, i) => [i, []]));

    input.forEach((step) => {
        const label = step.split(/[-=]/g)[0];
        const boxTarget = getHash(label);

        if (step.includes('-')) {
            const newBoxContent = (hashMap.get(boxTarget) as Lens[]).filter(
                (lens) => lens.label !== label,
            );
            hashMap.set(boxTarget, newBoxContent);
        }

        if (step.includes('=')) {
            const focalLength = Number(step.split(/[-=]/g)[1]);
            const newLens = { label, focalLength };
            const boxContent = hashMap.get(boxTarget) as Lens[];
            if (boxContent.some((lens) => lens.label === label)) {
                const newBoxContent = boxContent.map((lens) =>
                    lens.label === label ? newLens : lens,
                );
                hashMap.set(boxTarget, newBoxContent);
            } else {
                hashMap.set(boxTarget, [...boxContent, newLens]);
            }
        }
    });

    const totalFocusingPower = Array.from(hashMap.entries()).reduce(
        (total, [boxTarget, boxContent]) => {
            const boxFocusingPower = boxContent.reduce((boxTotal, lens, i) => {
                const lensPower = (1 + boxTarget) * (i + 1) * lens.focalLength;
                return boxTotal + lensPower;
            }, 0);
            return total + boxFocusingPower;
        },
        0,
    );

    console.log('Part 2 solution:', totalFocusingPower);
}

solution();
