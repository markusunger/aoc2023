import { getInput } from '../utils/getInput';

type RaceRecord = {
    time: number;
    distance: number;
};

function getWinningWays(raceRecords: RaceRecord[]) {
    return raceRecords.reduce((winningWays, race) => {
        let wins = 0;
        for (let i = 0; i <= race.time; i += 1) {
            const distance = (race.time - i) * i;
            if (distance > race.distance) wins += 1;
        }
        return winningWays === 0 ? wins : winningWays * wins;
    }, 0);
}

async function solution() {
    const input = await getInput();

    const raceRecords: RaceRecord[] = input[0].match(/\d+/g)!.map((time, idx) => ({
        time: Number(time),
        distance: input[1].match(/\d+/g)!.map(Number)[idx],
    }));

    const totalWinningWays = getWinningWays(raceRecords);

    console.log('Part 1 solution:', totalWinningWays);

    const singleRace: RaceRecord[] = input[0]
        .replace(/\s/g, '')
        .match(/\d+/g)!
        .map((time) => ({
            time: Number(time),
            distance: Number(input[1].replace(/\s/g, '').match(/\d+/g)![0]),
        }));

    const singleRaceWinningWays = getWinningWays(singleRace);

    console.log('Part 2 solution:', singleRaceWinningWays);
}

solution();
