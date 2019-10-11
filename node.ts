import * as chalk from 'chalk';
export class Node<T> {
  name: string;
  running = false;
  children: Node<T>[];
  recalc = 0;
  count = 0;
  data: T;
  static depth = 1;
  isInput = false;

  constructor(data?: T, name?: string) {
    if (data) this.isInput = true;
    this.data = data;
    this.name = name;
    this.children = [];
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

  reset() {
    if (!this.isInput) {
      console.warn(`resetting: ${this.name}`);
      this.data = undefined;
      if (this.children && this.children.length > 0) this.resetChildren();
    }
  }

  resetChildren() {
    for (let child of this.children) {
      if (child.data && !child.running) child.reset();
    }
  }

  run() {
    this.print('run', this.name + (this.data ? ` => ${this.data}` : ''));
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
        this.resetChildren();
        this.data = this.calc() as any;
        this.print(`[Recalc: ${i}] ${this.name} => ${this.data}`)
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
