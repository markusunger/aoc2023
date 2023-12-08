import { getInput } from '../utils/getInput';

type CardValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'A' | 'K' | 'Q' | 'J' | 'T' | 'Joker';
type Hand = [CardValue, CardValue, CardValue, CardValue, CardValue];
interface Bid {
    hand: Hand;
    bid: number;
}

function parseHandsAndBids(input: string[], withJoker: boolean = false) {
    const handsAndBids: Bid[] = [];

    input.forEach((line) => {
        const hand = line
            .match(/^[2-9AKQJT]*/g)![0]
            .split('')
            .map((card) => {
                if (card === 'J' && withJoker) return 'Joker' as CardValue;
                if (['A', 'K', 'Q', 'J', 'T'].includes(card)) return card as CardValue;
                return Number(card) as CardValue;
            }) as Hand;

        const bid = Number(line.match(/\d+$/g)![0]);

        handsAndBids.push({ hand, bid });
    });

    return handsAndBids;
}

function getCardValue(card: CardValue): number {
    if (card === 'A') return 14;
    if (card === 'K') return 13;
    if (card === 'Q') return 12;
    if (card === 'J') return 11;
    if (card === 'T') return 10;
    if (card === 'Joker') return 1;
    return card;
}

function getHandStrength(hand: Hand, withJoker: boolean = false): number {
    const { isFiveOfAKind, isFourOfAKind, isThreeOfAKind, isTwoPair, isPair, isFullHouse } =
        (() => {
            const cardCount = hand.reduce(
                (acc, card) => {
                    acc[card] = acc[card] ? acc[card] + 1 : 1;
                    return acc;
                },
                {} as Record<CardValue, number>,
            );

            const cardCountWithoutJokers = Object.fromEntries(
                Object.entries(cardCount).filter(([card]) => card !== 'Joker'),
            );

            const maxCount = Math.max(...Object.values(cardCountWithoutJokers));

            const isFiveOfAKind =
                maxCount === 5 ||
                (withJoker && maxCount + cardCount['Joker'] === 5) ||
                cardCount['Joker'] === 5;
            const isFourOfAKind =
                !isFiveOfAKind &&
                (maxCount === 4 || (withJoker && maxCount + cardCount['Joker'] === 4));
            const isThreeOfAKind =
                !isFourOfAKind &&
                (maxCount === 3 || (withJoker && maxCount + cardCount['Joker'] === 3));
            const isTwoPair =
                Object.values(cardCountWithoutJokers).filter((count) => count === 2).length === 2 ||
                (withJoker &&
                    ((Object.values(cardCountWithoutJokers).filter((count) => count === 2)
                        .length === 1 &&
                        cardCount['Joker'] === 1) ||
                        (Object.values(cardCountWithoutJokers).filter((count) => count === 2)
                            .length === 0 &&
                            cardCount['Joker'] === 2)));
            const isPair =
                Object.values(cardCountWithoutJokers).includes(2) ||
                (withJoker &&
                    Object.values(cardCountWithoutJokers).some(
                        (count) => count + cardCount['Joker'] === 2,
                    ));
            const isFullHouse =
                (!withJoker && isThreeOfAKind && isPair) ||
                (withJoker &&
                    ((Object.values(cardCountWithoutJokers).includes(3) &&
                        Object.values(cardCountWithoutJokers).includes(2)) ||
                        (Object.values(cardCountWithoutJokers).includes(3) &&
                            cardCount['Joker'] === 2) ||
                        (isPair && cardCount['Joker'] === 3) ||
                        (Object.values(cardCountWithoutJokers).filter((n) => n === 2).length ===
                            2 &&
                            cardCount['Joker'] === 1) ||
                        (isPair &&
                            cardCount['Joker'] === 2 &&
                            Object.values(cardCountWithoutJokers).includes(3))));

            return {
                isFiveOfAKind,
                isFourOfAKind,
                isThreeOfAKind,
                isTwoPair,
                isPair,
                isFullHouse,
            };
        })();

    if (isFiveOfAKind) return 6;
    if (isFourOfAKind) return 5;
    if (isFullHouse) return 4;
    if (isThreeOfAKind) return 3;
    if (isTwoPair) return 2;
    if (isPair) return 1;
    return 0;
}

function compareHands(hand1: Hand, hand2: Hand, withJoker: boolean = false): number {
    const hand1Strength = getHandStrength(hand1, withJoker);
    const hand2Strength = getHandStrength(hand2, withJoker);

    if (hand1Strength > hand2Strength) return 1;
    if (hand1Strength < hand2Strength) return -1;

    for (let i = 0; i < hand1.length; i += 1) {
        if (getCardValue(hand1[i]) > getCardValue(hand2[i])) return 1;
        if (getCardValue(hand1[i]) < getCardValue(hand2[i])) return -1;
    }

    return 0;
}

async function solution() {
    const input = await getInput();

    const handsWithoutJoker = parseHandsAndBids(input);

    const sortedHandsWithoutJoker = handsWithoutJoker.sort((a, b) => compareHands(a.hand, b.hand));

    const totalWinningsPart1 = sortedHandsWithoutJoker.reduce((total, hand, idx) => {
        return total + hand.bid * (idx + 1);
    }, 0);

    console.log('Part 1 solution:', totalWinningsPart1);

    const handsWithJoker = parseHandsAndBids(input, true);

    const sortedHandsWithJoker = handsWithJoker.sort((a, b) => compareHands(a.hand, b.hand, true));

    const totalWinningsPart2 = sortedHandsWithJoker.reduce((total, hand, idx) => {
        return total + hand.bid * (idx + 1);
    }, 0);

    console.log('Part 2 solution:', totalWinningsPart2);
}

solution();
