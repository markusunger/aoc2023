import fs from 'fs/promises';

interface GetInputOptions {
    test?: boolean;
    splitOn?: string;
}

const GetInputOptionsDefault = {
    test: false,
    splitOn: '\n',
    transform: (input: string) => input,
};

export const getInput = async ({ test, splitOn }: GetInputOptions = {}): Promise<string[]> => {
    const input = await fs.readFile('input' + (test ? '_test' : ''), 'utf-8');
    return input.split(splitOn || GetInputOptionsDefault.splitOn);
};
