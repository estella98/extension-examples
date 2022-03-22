import { ISessionContext, SessionContext } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { ICodeCellModel } from '@jupyterlab/cells';
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
    let codeOutput = this.activateCopyOutput(app, tracker);
    this._outputarea = new MainAreaWidget({ content: this._content });
    this.addWidget(this._outputarea);
    this.addWidget(new KernelView(app, tracker, 'DEFAULT TITLE', codeOutput));
  }

  get session(): ISessionContext {
    return this._sessionContext;
  }

  dispose(): void {
    this._sessionContext.dispose();
    super.dispose();
  }

  activateCopyOutput(app: JupyterFrontEnd, notebookTracker: INotebookTracker) {
    let outputData = null;
    console.log('activate Copy Output is called');
    if (notebookTracker.activeCell) {
      let codeCell = notebookTracker.activeCell.model as ICodeCellModel;
      console.log(codeCell);
      let outputs = codeCell.outputs;
      console.log(outputs);
      for (let i = 0; i < outputs.length; i++) {
        // IOutputModel
        outputData = outputs.get(i).toJSON().data as any;
        outputData = outputData['text/html'];
        console.log(outputData);
      }
    }
    return outputData;
  }

  async generate_Content(
    content: Widget,
    app: JupyterFrontEnd,
    notebookTracker: INotebookTracker
  ): Promise<void> {
    console.log(96);

    // add title

    // Add an image element to the content
    //let img = document.createElement('img');
    //content.node.appendChild(img);

    // Get a random date string in YYYY-MM-DD format
    // function randomDate() {
    //   const start = new Date(2010, 1, 1);
    //   const end = new Date();
    //   const randomDate = new Date(start.getTime() + Math.random()*(end.getTime() - start.getTime()));
    //   return randomDate.toISOString().slice(0, 10);
    // }

    // Fetch info about a random picture
    //const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${randomDate()}`);
    //const backgroundImg = await response.json() as APODResponse;

    // if (backgroundImg.media_type === 'image') {
    //   // Populate the image
    //   img.src = backgroundImg.url;
    //   img.title = backgroundImg.title;
    // } else {
    //   console.log('Random APOD was not a picture.');
    // }
    //let codeOutput = await this.activateCopyOutput(app, notebookTracker )
    // let outputComp = (
    //       {codeOutput}
    //  </div>)
    // let divElem= document.createElement('div');
    // content.node.appendChild(divElem)
    // divElem.innerHTML = codeOutput
    // console.log("content is \t", content)
  }

  // execute(code: string): void {
  //   SimplifiedOutputArea.execute(code, this._outputarea, this._sessionContext)
  //     .then((msg: KernelMessage.IExecuteReplyMsg) => {
  //       console.log(msg);
  //     })
  //     .catch((reason) => console.error(reason));
  // }

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
