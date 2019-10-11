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
    const f = new Node<number>(undefined, 'f');
    const g = new Node<number>(1, 'g');
    const h = new Node<number>(undefined, 'h');

    root.add(a).add(b);

    a.add(c).add(f);
    
    b.add(c);

    c.add(d);

    d.add(a).add(e);

    f.add(g).add(h);
    
    h.add(e);

    root.run()
    console.log('Final value =>', root.data);
    console.log('================ End =================\n');
  }
}

Runner.Run();