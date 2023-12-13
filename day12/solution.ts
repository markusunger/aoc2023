import { isEqual } from 'lodash';
import { getInput } from '../utils/getInput';

const States = ['.', '#'];

function getAllCombinations(
    length: number,
    prefix: string = '',
    combinations: string[] = [],
): string[] {
    if (length === 0) {
        combinations.push(prefix);
        return combinations;
    }

    for (let i = 0; i < States.length; i++) {
        getAllCombinations(length - 1, prefix + States[i], combinations);
    }

    return combinations;
}

function getTotalValidCombinations(conditionRecords: { condition: string; groups: number[] }[]) {
    return conditionRecords.reduce((total, record) => {
        const { condition, groups } = record;

        const unknownsPossibilities = [...condition.matchAll(/\?/g)].length;
        const combinations = getAllCombinations(unknownsPossibilities);

        const validCombinations = combinations.filter((combination) => {
            let newCondition = condition;
            let unknownCount = 0;
            while (/\?/g.exec(newCondition)) {
                newCondition = newCondition.replace('?', combination[unknownCount]);
                unknownCount++;
            }

            const matchesGroups = (() => {
                const conditionGroups = newCondition
                    .split(/\.+/g)
                    .filter(Boolean)
                    .map((a) => a.length);
                return isEqual(conditionGroups, groups);
            })();

            return matchesGroups;
        });

        return total + validCombinations.length;
    }, 0);
}

async function solution() {
    const input = await getInput({ test: true });

    const conditionRecords = input.map((line) => ({
        condition: line.split(' ')[0],
        groups: line.split(' ')[1].split(',').map(Number),
    }));

    const totalFolded = getTotalValidCombinations(conditionRecords);

    console.log('Part 1 solution:', totalFolded);

    const unfoldedConditionRecords = conditionRecords.map((record) => ({
        condition: Array.from({ length: 5 })
            .map(() => record.condition)
            .join('?'),
        groups: Array.from({ length: 5 })
            .map(() => record.groups)
            .flat(),
    }));

    const totalUnfolded = getTotalValidCombinations(unfoldedConditionRecords);

    console.log('Part 2 solution:', totalUnfolded);
}

solution();
