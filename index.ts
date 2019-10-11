import { Node } from './node';
export class Runner {
  static Run() {
    console.log('\n================ Start ================');
    const root = new Node<number>(undefined, 'root');
    const a = new Node<number>(undefined, 'a');
    a.recalc = 2;
    const b = new Node<number>(undefined, 'b');
    const c = new Node<number>(undefined, 'c');
    const d = new Node<number>(undefined, 'd');
    const e = new Node<number>(10, 'e');

    root.add(a);
    root.add(b);

    a.add(c);
    
    b.add(c);

    c.add(d);

    d.add(a);
    d.add(e);

    root.run()
    console.log('Final value =>', root.data);
    console.log('================ End =================\n');
  }
}

Runner.Run();