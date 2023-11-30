import path from 'path';
import { spawn } from 'child_process';

const [, , dayString] = process.argv;
const day = parseInt(dayString, 10);

if (Number.isNaN(day)) {
    console.error(
        'Please start with npm start <day> - day being the numerical value of the day you want to solve the puzzle for.',
    );
    process.exit(1);
}

async function main() {
    spawn('nodemon', ['-x', 'ts-node', `./solution.ts`], {
        stdio: 'inherit',
        shell: true,
        cwd: path.join(__dirname, day < 10 ? `day0${day}` : `day${day.toString()}`),
    });
}

try {
    main();
} catch (e) {
    console.error(e);
}
