import {
  ISessionContext,
  SessionContext,

} from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';


import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { MainAreaWidget } from '@jupyterlab/apputils';
import {  ServiceManager } from '@jupyterlab/services';

import {
  ITranslator,
  nullTranslator,
  TranslationBundle,
} from '@jupyterlab/translation';

import { Message } from '@lumino/messaging';

import { StackedPanel } from '@lumino/widgets';

/**
 * The class name added to the example panel.
 */
const PANEL_CLASS = 'jp-RovaPanel';

/**
 * A panel with the ability to add other children.
 */
export class ExamplePanel extends StackedPanel {
  constructor(
    manager: ServiceManager.IManager,
    rendermime: IRenderMimeRegistry,
    translator?: ITranslator
  ) {
    super();
    this._translator = translator || nullTranslator;
    this._trans = this._translator.load('jupyterlab');
    this.addClass(PANEL_CLASS);
    this.id = 'kernel-output-panel';
    this.title.label = this._trans.__('Presentation Kernel Example View');
    this.title.closable = true;
  
  
    this._content = new Widget()
    this.generate_Content(this._content)
    
    this._outputarea =  new MainAreaWidget({content: this._content});
    this.addWidget(this._outputarea);

    
  }

  get session(): ISessionContext {
    return this._sessionContext;
  }

  dispose(): void {
    this._sessionContext.dispose();
    super.dispose();
  }

  async generate_Content(content:Widget):Promise<void>{

    interface APODResponse {
      copyright: string;
      date: string;
      explanation: string;
      media_type: 'video' | 'image';
      title: string;
      url: string;
    };
    
    // Add an image element to the content
    let img = document.createElement('img');
    content.node.appendChild(img);

    // Get a random date string in YYYY-MM-DD format
    function randomDate() {
      const start = new Date(2010, 1, 1);
      const end = new Date();
      const randomDate = new Date(start.getTime() + Math.random()*(end.getTime() - start.getTime()));
      return randomDate.toISOString().slice(0, 10);
    }

    // Fetch info about a random picture
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${randomDate()}`);
    const data = await response.json() as APODResponse;

    if (data.media_type === 'image') {
      // Populate the image
      img.src = data.url;
      img.title = data.title;
    } else {
      console.log('Random APOD was not a picture.');
    }

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
  private _outputarea:MainAreaWidget;
  private _content: Widget;
  private _translator: ITranslator;
  private _trans: TranslationBundle;
}
