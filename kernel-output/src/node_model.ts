import { Cell, ICellModel } from '@jupyterlab/cells';

export class NodeModel {
  selectedNodes: Cell<ICellModel>[];

  constructor() {
    this.selectedNodes = [];
  }

  selectCell(cell: Cell<ICellModel>) {
    let selectedOrNot =
      this.selectedNodes.filter((obj) => obj === cell).length > 0;
    if (!selectedOrNot) {
      this.selectedNodes.push(cell);
      console.log('pushed nodes to the list');
    } else {
      this.selectedNodes = this.selectedNodes.filter((obj) => obj !== cell);
    }
  }
}
