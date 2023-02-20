/*
 * DoublyLinkedList Implementation for Page Buttons
 */
export default class DoublyLinkedList<T> implements Iterable<T> {
    private headNode: Node<T> | null;
    private tailNode: Node<T> | null;
    public length: number;

    constructor(startValue: T) {
        const node = new Node(startValue);
        this.headNode = node;
        this.tailNode = node;
        this.length = 1;
    }

    prepend(value: T) {
        const node = new Node(value, null, this.headNode);
        if (this.headNode === null) {
            this.headNode = node;
            this.tailNode = node;
            this.length = 1;
        } else {
            this.headNode.prevNode = node;
            this.headNode = node;
            this.length++;
        }
    }

    append(value: T) {
        const node = new Node(value, this.tailNode, null);
        if (this.tailNode === null) {
            this.headNode = node;
            this.tailNode = node;
            this.length = 1;
        } else {
            this.tailNode.nextNode = node;
            this.tailNode = node;
            this.length++;
        }
    }

    private getNode(index: number): Node<T> | null {
        let count = 0;
        let currentNode = this.headNode;
        while (count++ < index) {
            currentNode = currentNode?.nextNode ?? null;
        }
        return currentNode;
    }

    get(index: number): T | null {
        return this.getNode(index)?.value ?? null;
    }

    set(index: number, value: T) {
        const node = this.getNode(index);
        if (node !== null) {
            node.value = value;
        }
    }

    *[Symbol.iterator]() {
        let currentNode = this.headNode;
        while (currentNode !== null) {
            yield currentNode.value;
            currentNode = currentNode.nextNode;
        }
    }
}

class Node<T> {
    public prevNode: Node<T> | null;
    public value: T;
    public nextNode: Node<T> | null;

    constructor(
        value: T,
        prevNode: Node<T> | null = null,
        nextNode: Node<T> | null = null
    ) {
        this.prevNode = prevNode;
        this.value = value;
        this.nextNode = nextNode;
    }
}

function test() {
    const list = new DoublyLinkedList(3);

    list.prepend(2);
    list.append(4);
    list.prepend(1);
    list.append(5);

    // Should be 1,2,3,4,5 in that order
    // for (let i = 0; i < list.length(); i++) {
    //     console.log(list.get(i));
    // }

    for (const v of list) {
        console.log(v);
    }
}

// test();
