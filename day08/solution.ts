import { getInput } from '../utils/getInput';

class GraphNode {
    name: string;
    left: GraphNode | null;
    right: GraphNode | null;

    constructor(name: string) {
        this.name = name;
        this.left = null;
        this.right = null;
    }
}

class BinaryGraph {
    private nodes: Map<string, GraphNode>;

    constructor() {
        this.nodes = new Map<string, GraphNode>();
    }

    addNode(name: string, leftName: string, rightName: string): void {
        let node = this.nodes.get(name);
        if (!node) {
            node = new GraphNode(name);
            this.nodes.set(name, node);
        }

        let leftNode = this.nodes.get(leftName);
        if (!leftNode) {
            leftNode = new GraphNode(leftName);
            this.nodes.set(leftName, leftNode);
        }
        node.left = leftNode;

        let rightNode = this.nodes.get(rightName);
        if (!rightNode) {
            rightNode = new GraphNode(rightName);
            this.nodes.set(rightName, rightNode);
        }
        node.right = rightNode;
    }

    getNode(name: string): GraphNode | undefined {
        return this.nodes.get(name);
    }

    getAllStartNodes = (): GraphNode[] => {
        const nodes = Array.from(this.nodes.values());
        return nodes.filter((node) => node.name.endsWith('A'));
    };
}

function greatestCommonDivisor(a: number, b: number): number {
    while (b !== 0) {
        const t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function lowestCommonDenominator(denominators: number[]): number {
    return denominators.reduce((a, b) => lowestCommonMultiple(a, b));
}

function lowestCommonMultiple(a: number, b: number): number {
    return (a * b) / greatestCommonDivisor(a, b);
}

async function solution() {
    const input = await getInput();

    const directions = input.shift()?.split('') as string[];
    const treeNodes = input.slice(1);

    const tree = new BinaryGraph();
    for (const node of treeNodes) {
        const re = /(\w+)\s=\s\((\w+),\s(\w+)/g.exec(node);
        const [name, left, right] = (re as RegExpExecArray).slice(1);
        tree.addNode(name, left, right);
    }

    let currentNode = tree.getNode('AAA') as GraphNode;

    let steps = 0;
    let dirIndex = 0;

    while (currentNode.name !== 'ZZZ') {
        const direction = directions?.[dirIndex];
        if (currentNode.left && direction === 'L') {
            currentNode = currentNode.left;
        } else if (currentNode.right && direction === 'R') {
            currentNode = currentNode.right;
        }

        steps += 1;

        dirIndex++;
        if (dirIndex >= directions.length) {
            dirIndex = 0;
        }
    }

    console.log('Part 1 solution:', steps);

    const startNodes = tree.getAllStartNodes();

    const cycleTimes = startNodes.map((node) => {
        let currentNode = node;
        let dirIndex = 0;
        let steps = 0;

        while (!currentNode.name.endsWith('Z')) {
            const direction = directions?.[dirIndex];
            if (currentNode.left && direction === 'L') {
                currentNode = currentNode.left;
            } else if (currentNode.right && direction === 'R') {
                currentNode = currentNode.right;
            }

            steps += 1;

            dirIndex++;
            if (dirIndex >= directions.length) {
                dirIndex = 0;
            }
        }

        return steps;
    });

    console.log('Part 2 solution:', lowestCommonDenominator(cycleTimes));
}

solution();
