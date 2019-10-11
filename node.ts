import * as chalk from 'chalk';
import { Traverser } from './tree-utility';
export class Node<T> {
  name: string;
  running = false;
  children: Node<T>[];
  recalc = 0;
  count = 0;
  data: T;
  static depth = 1;
  isInput = false;

  resets = {
    1: this.reset1.bind(this),
    2: this.reset2.bind(this)
  };

  constructor(data?: T, name?: string) {
    if (data) this.isInput = true;
    this.data = data;
    this.name = name;
    this.children = [];
  }

  hasDescendant(node: Node<T>) {
    const traverser = new Traverser<T>(this);
    return traverser.find(node);
  }

  get hasChildren() {
    return this.children && this.children.length > 0;
  }

  hasChild(node: Node<T>) {
    if (this.hasChildren) {
      return this.children.includes(node);
    }

    return false;
  }

  add(child: Node<T>) {
    if (!this.children) this.children = [];
    this.children.push(child);
    return this;
  }

  remove(child: Node<T>) {
    const idx = this.children.indexOf(child);
    if (idx > -1) this.children.splice(idx, 1);
    return this;
  }

  reset(type: number = 1) {
    this.resets[type]();
  }

  reset1() {
    if (!this.isInput) {
      console.warn(`resetting: ${this.name}`);
      this.data = undefined;
      if (this.children && this.children.length > 0) this.resetChildren1();
    }
  }

  reset2() {
    if (!this.isInput) {
      console.warn(`resetting: ${this.name}`);
      this.data = undefined;
      if (this.children && this.children.length > 0) this.resetChildren2();
    }
  }

  resetChildren1() {
    for (let child of this.children) {
      if (child.data && !child.running) child.reset(1);
    }
  }

  resetChildren2() {
    for (let child of this.children) {
      if (child.data && !child.running && child.hasDescendant(this)) child.reset(1);
    }
  }

  run() {
    this.printBold('[Run]', this.name + (this.data ? ` => ${this.data}` : ''));
    this.count++;
    if (this.running && !this.data) {
      this.print('[transient]', this.name, '=>', 0);
      return 0;
    } else if (this.data) {
      return this.data;
    }

    this.running = true;

    if (this.recalc > 0) {
      for (let i = 1; i <= this.recalc; i++) {
        console.warn(`starting recalc for ${this.name} [${i}]`);
        this.resetChildren2();
        this.data = this.calc() as any;
        this.print(`[Recalc: ${i}] ${this.name} => ${this.data}`);
      }
    } else {
      this.data = this.calc() as any;
    }
    this.count--;
    this.running = false;
    this.printBold(`[Calculated] ${this.name} => ${this.data}`);
    return this.data;
  }

  calc() {
    this.print('calc', this.name, `=> (${this.children.map(c => c.name).join(', ')})`);
    let result: number = 0;
    const d = Node.depth;
    Node.depth++;
    for (let i = 0; i < this.children.length; i++) {
      result += this.children[i].run() as number;
    }
    Node.depth = d;
    return result;
  }

  print(...args: any[]) {
    const spacer: string = '\t';

    console.log(Node.getChalk(Node.depth)(spacer.repeat(Node.depth), ...args));
  }

  printBold(...args: any[]) {
    const spacer: string = '\t';

    console.log(Node.getChalk(Node.depth).bold(spacer.repeat(Node.depth), ...args));
  }

  static getChalk(i: number) {
    i = i % Object.keys(this.chalks).length;
    return this.chalks[i];
  }

  static chalks = {
    1: chalk.default.green,
    2: chalk.default.cyan,
    3: chalk.default.yellow,
    0: chalk.default.magenta
  };
}
