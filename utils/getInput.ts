import fs from 'fs/promises';

export const getInput = async (options: { test: boolean } = { test: false }): Promise<string[]> => {
    const input = await fs.readFile('input' + options.test ? '_test' : '', 'utf-8');
    return input.split('\n');
};
