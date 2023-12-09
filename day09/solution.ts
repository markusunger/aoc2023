import { getInput } from '../utils/getInput';

function getDifferences(history: number[]): number[] {
    const differences: number[] = [];

    for (let i = 1; i < history.length; i += 1) {
        differences.push(history[i] - history[i - 1]);
    }
    return differences;
}

function getNextValue(history: number[]): number {
    if (history.every((value) => value === history[0])) {
        return history[0];
    }

    const diffs = getDifferences(history);
    const nextDiff = getNextValue(diffs);
    return history[history.length - 1] + nextDiff;
}

async function solution() {
    const input = await getInput();

    const histories = input.map((line) => line.split(' ').map(Number));

    const values = histories.reduce((total, history) => {
        const nextValue = getNextValue(history);
        return total + nextValue;
    }, 0);

    console.log('Part 1 solution:', values);

    const newHistories = histories.map((history) => history.reverse());

    const newValues = newHistories.reduce((total, history) => {
        const nextValue = getNextValue(history);
        return total + nextValue;
    }, 0);

    console.log('Part 2 solution:', newValues);
}

solution();
