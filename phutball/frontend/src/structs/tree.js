
/******************************************************************************
*
* Generic tree structure
*  - Can have multiple root nodes
*  - For insertion, all a node's children must come consecutively
*     after the node.
*  - As used, insertion will often be as a child of the most recently added
*     node, or one of its parents or siblings. Hence, an "active node"
*     is maintained to start searches. Likewise, to enable, references
*     to the parent are maintained. Furthermore, once a node is deactivated
*     it will receive no further children and is never again searched.
*  - Data structure is mutable
*
******************************************************************************/

export default class Tree {
  constructor(value, parent, children) {
    this.value      = value  //undefined for root
    this.parent     = parent //undefined for root

    if (children !== undefined) {
      this.children = children
    } else {
      this.children = []
    }

    // Index of active node. -1 if undefined
    this.activeNode = this.children.length - 1
  } 

  addChild(child) {
    const childNode = new Tree(child, this)
    this.children.push(childNode)
    this.activeNode  = this.children.length - 1
    return childNode
  }

  // Call as copy(). Parent is necessary
  //  to retain parent references
  copy(parent) {
    return new Tree(
                this.value,
                parent,
                this.children.map(
                  child => child.copy(this)
                )
              )
  }

  // Recurses downward. Operation is in-place
  map(func) {
    if (this.value !== undefined) {
      this.value = func(this.value)
    }
    this.children.map(child => child.map(func))
    return this
  }

  // Search for a node with value matching the predicate
  //  and then call action with that node
  // Root node matches all predicates if no searched nodes match
  search(predicate, action) {
    if (this.activeNode === -1) {
      if (this.parent === undefined) {
        return action(this)
      } else {
        return this.parent.search(predicate, action)
      }
    }

    const toTest = this.children[this.activeNode]

    if (predicate(toTest)) {
      return action(toTest)
    } else {
      this.activeNode -= 1;
      return this.search(predicate, action)
    }
  }

  // Build a tree. Each element of the list is added
  //  as the child of the node satisfying
  //  predicate(newNode, node) or otherwise as Root
  static buildTreeAsChildofMatch(list, predicate) {
    var tree = new Tree();

    var activeNode = tree;

    for (var i = 0; i < list.length; i ++) {
      const element = list[i]
      activeNode = activeNode.search(
          node => predicate(element, node.value),
          node => node.addChild(element),
      )   
    }

    return tree
  }

  toList() { 
    const childLists = this.children.map(child => child.toList())
    let thisList;
    if (this.value === undefined) {
      thisList = []
    } else {
      thisList = [this.value]
    }
    return thisList.concat(...childLists)
  }
}