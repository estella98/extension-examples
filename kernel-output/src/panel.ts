import { ISessionContext, SessionContext } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';
import { JupyterFrontEnd } from '@jupyterlab/application';
//import { ICodeCellModel, MarkdownCell } from '@jupyterlab/cells';
import { INotebookTracker } from '@jupyterlab/notebook';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { ServiceManager } from '@jupyterlab/services';

import {
  ITranslator,
  nullTranslator,
  TranslationBundle,
} from '@jupyterlab/translation';

import { Message } from '@lumino/messaging';

import { StackedPanel } from '@lumino/widgets';
import { KernelView } from './widget';
import { model } from './index';

/**
 * The class name added to the example panel.
 */
const PANEL_CLASS = 'jp-RovaPanel';

/**
 * A panel with the ability to add other children.
 */
export class ExamplePanel extends StackedPanel {
  constructor(
    app: JupyterFrontEnd,
    tracker: INotebookTracker,
    manager: ServiceManager.IManager,
    rendermime: IRenderMimeRegistry,
    translator?: ITranslator
  ) {
    super();
    this._translator = translator || nullTranslator;
    this._trans = this._translator.load('jupyterlab');
    this.addClass(PANEL_CLASS);
    this.id = 'kernel-output-panel';
    this.title.label = this._trans.__('Presentation View');
    this.title.closable = true;
    this._content = new Widget();
    //let codeOutput = this.activateCopyOutput(app, tracker);
    this._outputarea = new MainAreaWidget({ content: this._content });
    this.addWidget(this._outputarea);
    this.addWidget(new KernelView(app, tracker, 'DEFAULT TITLE'));
  }

  get session(): ISessionContext {
    return this._sessionContext;
  }

  dispose(): void {
    this._sessionContext.dispose();
    super.dispose();
  }

  activateCopyOutput(
    app: JupyterFrontEnd,
    notebookTracker: INotebookTracker
  ): any {
    let outputData = null;
    console.log('panel.ts: activate Copy Output is called', model);
    let presentDict: { code: 0; markdown: 0; raw: 0 };
    model.selectedNodes.forEach((element, index, array) => {
      console.log('each element', element.model.type);
      switch (element.model.type) {
        case 'code':
          presentDict.code += 1;
          break;
        case 'markdown':
          presentDict.markdown += 1;
          break;
        case 'raw':
          presentDict.raw += 1;
          break;
        default:
          console.log('default');
      }
      //switch between different presentation template
    });

    // if (notebookTracker.activeCell) {
    //   let codeCell = notebookTracker.activeCell.model as ICodeCellModel;
    //   console.log(codeCell);
    //   let outputs = codeCell.outputs;
    //   console.log(outputs);
    //   for (let i = 0; i < outputs.length; i++) {
    //     // IOutputModel
    //     outputData = outputs.get(i).toJSON().data as any;
    //     outputData = outputData['text/html'];
    //     console.log(outputData);
    //   }
    // }
    return outputData;
  }

  protected onCloseRequest(msg: Message): void {
    super.onCloseRequest(msg);
    this.dispose();
  }

  private _sessionContext: SessionContext;
  private _outputarea: MainAreaWidget;
  private _content: Widget;
  private _translator: ITranslator;
  private _trans: TranslationBundle;
}
