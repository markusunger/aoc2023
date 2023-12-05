import { chunk } from 'lodash';
import { getInput } from '../utils/getInput';

interface Range {
    source: number;
    destination: number;
    length: number;
}

function parseInput(input: string[], useSeedRanges: boolean): [number[] | number[][], Range[][]] {
    const seeds = (() => {
        const seedNumbers = input.shift()?.match(/\d+/g)?.map(Number) as number[];
        if (useSeedRanges) {
            return chunk(seedNumbers, 2);
        } else {
            return seedNumbers;
        }
    })();
    const maps: Range[][] = [];
    let currentMap: Range[] = [];

    input.forEach((line) => {
        if (line.endsWith('map:') || line === '') {
            if (currentMap.length > 0) {
                maps.push(currentMap);
                currentMap = [];
            }
        } else {
            const range = line.match(/\d+/g)?.map(Number) as number[];
            currentMap.push({ source: range[1], destination: range[0], length: range[2] });
        }
    });

    if (currentMap.length > 0) {
        maps.push(currentMap);
    }

    return [seeds, maps];
}

async function solution() {
    const input = await getInput();
    const [seeds, maps] = parseInput(structuredClone(input), false);

    const getLowestLocation = (seeds: number[]) =>
        seeds.reduce((lowestLocation, seed) => {
            const location = maps.reduce((source, map) => {
                // console.log(`Checking ${source} in map ${JSON.stringify(map)}`);
                const fittingMap = map.find(
                    (range) => range.source <= source && range.source + range.length > source,
                );
                if (!fittingMap) {
                    // console.log(`${source} -> ${source}`);
                    return source;
                }
                const destination = fittingMap.destination + (source - fittingMap.source);
                // console.log(`${source} -> ${destination}`);
                return destination;
            }, seed);

            if (location < lowestLocation) {
                return location;
            }
            return lowestLocation;
        }, Infinity);

    const lowestLocation = getLowestLocation(seeds as number[]);

    console.log('Part 1 solution:', lowestLocation);

    const time = performance.now();
    const [seedRanges] = parseInput(structuredClone(input), true);

    const lowestLocationPart2 = (seedRanges as number[][]).reduce((lowestLocation, seedRange) => {
        let localLow = Infinity;

        for (let i = seedRange[0]; i < seedRange[0] + seedRange[1]; i += 1) {
            // console.log(`Testing seed ${i}`);
            const location = getLowestLocation([i]);
            if (location < localLow) {
                localLow = location;
            }
        }

        if (localLow < lowestLocation) {
            return localLow;
        }

        return lowestLocation;
    }, Infinity);

    console.log('Part 2 solution:', lowestLocationPart2);
}

solution();
