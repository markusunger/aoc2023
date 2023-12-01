import { getInput } from '../utils/getInput';

const numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const numbersReverse = numbers.map((s) => s.split('').reverse().join(''));

function findFirstDigit(
    str: string,
    options: { findNumberWords: boolean; checkReversedWords: boolean } = {
        findNumberWords: false,
        checkReversedWords: false,
    },
): number {
    const digitMatch = /\d/.exec(str) as RegExpExecArray;

    if (options.findNumberWords) {
        const wordMatch = new RegExp(
            (options.checkReversedWords ? numbersReverse : numbers).join('|'),
        ).exec(str);

        if (!digitMatch || (wordMatch && wordMatch.index < digitMatch.index)) {
            return (options.checkReversedWords ? numbersReverse : numbers).indexOf(wordMatch![0]);
        }
    }

    return parseInt(digitMatch[0], 10);
}

async function solution(): Promise<void> {
    const input = await getInput();

    // Part 1 solution
    const part1 = input.reduce((acc, cur) => {
        const first = findFirstDigit(cur);
        const last = findFirstDigit(cur.split('').reverse().join(''));

        return acc + Number(`${first as number}${last as number}`);
    }, 0);

    console.log(`Part 1 solution: ${part1}`);

    // Part 2 solution
    const part2 = input.reduce((acc, cur) => {
        const first = findFirstDigit(cur, { findNumberWords: true, checkReversedWords: false });
        const last = findFirstDigit(cur.split('').reverse().join(''), {
            findNumberWords: true,
            checkReversedWords: true,
        });

        return acc + Number(`${first}${last}`);
    }, 0);

    console.log(`Part 2 solution: ${part2}`);
}

solution();
