import { intersection } from 'lodash';
import { getInput } from '../utils/getInput';

function getMatches(card: string) {
    const [, winning, picks] = card.split(/[:||]/g);
    return intersection(winning.match(/\d+/g)!.map(Number), picks.match(/\d+/g)!.map(Number));
}

async function solution() {
    const input = await getInput();

    const pointsTotal = input.reduce((acc, curr) => {
        const matches = getMatches(curr);
        const points = matches.reduce((res) => (res === 0 ? 1 : res * 2), 0);
        return acc + points;
    }, 0);

    console.log('Part 1 solution:', pointsTotal);

    const scratchCards = input.map((card) => {
        return {
            copies: 1,
            matches: getMatches(card),
        };
    });

    scratchCards.forEach((card, idx) => {
        for (let i = 1; i <= card.copies; i++) {
            const newCopies = Array.from({ length: card.matches.length }, (_, i) => i + idx + 1);
            newCopies.forEach((num) =>
                scratchCards[num] ? (scratchCards[num].copies += 1) : undefined,
            );
        }
    });

    const totalCopies = scratchCards.reduce((acc, curr) => acc + curr.copies, 0);
    console.log('Part 2 solution:', totalCopies);
}

solution();
