import { Node } from './node';

export class Traverser<T> {
  visited = new Set<Node<T>>();
  queue = new Array<Node<T>>();

  constructor(public root: Node<T>) {}

  find(node: Node<T>) {
    if (!node.hasChildren) return false;
     let queue = [...this.root.children];
     let visited = new Set<Node<T>>();

     while (queue.length > 0) {
       let cur = queue.pop();
       visited.add(cur);
       if (cur === node) return true;

       if (cur.hasChildren) {
         for (let c of cur.children) {
           if (!visited.has(c)) queue.push(c);
         }
       }
     }

     return false;
  }

  walk(cb: (node: Node<T>) => void) {
    let queue = [this.root];
    let visited = new Set<Node<T>>();

    while(queue.length > 0) {
      let cur = queue.pop();
      visited.add(cur);
      if (cb) cb(cur);

      if (cur.hasChildren) {
        for (let c of cur.children) {
          if (!visited.has(c))
            queue.push(c);
        }
      }
    }
  }

}