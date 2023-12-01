import fs from 'fs/promises';

export const getInput = async (): Promise<string[]> => {
    const input = await fs.readFile('input', 'utf-8');
    return input.split('\n');
};
