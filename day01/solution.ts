import { getInput } from '../utils/getInput';

const numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

async function solution() {
    const input = await getInput();

    // Part 1 solution
    const part1 = input.reduce((acc, curr) => {
        const digits = curr
            .split('')
            .map(Number)
            .filter((n) => !isNaN(n));
        const [first, last] = [digits[0], digits[digits.length - 1]];
        return acc + Number(`${first}${last}`);
    }, 0);

    console.log(`Part 1 solution: ${part1}`);

    // Part 2 solution
    const part2 = input.reduce((acc, curr) => {
        const re = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))\1/g;
        const digits = [];
        let match: RegExpExecArray | null;

        while ((match = re.exec(curr)) !== null) {
            const wordMatch = numbers.findIndex((n) => n === match![0]);
            digits.push(wordMatch === -1 ? Number(match![0]) : wordMatch);
            re.lastIndex = match.index + 1;
        }

        const [first, last] = [digits[0], digits[digits.length - 1]];
        return acc + Number(`${first}${last}`);
    }, 0);

    console.log(`Part 2 solution: ${part2}`);
}

solution();
