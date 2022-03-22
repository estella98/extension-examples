import {
  ReactWidget, //,
  // UseSignal
} from '@jupyterlab/apputils';

import * as React from 'react';
import '../style/index.css';

import { JupyterFrontEnd } from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook';

export class KernelView extends ReactWidget {
  titleStr: String;
  outputData: any;
  constructor(
    app: JupyterFrontEnd,
    tracker: INotebookTracker,
    titleStr: string = 'DEFAULT TITLE',
    outputData: any
    // rendermime: IRenderMimeRegistry,
    // translator?: ITranslator
  ) {
    super();
    this.titleStr = titleStr;
    this.outputData = outputData;
  }

  generate_title() {
    let titleComp = (
      <div className={'presentation-title'}>
        <h1>{this.titleStr}</h1>
      </div>
    );
    return titleComp;
  }

  generate_output() {
    console.log('41\n', this.outputData);
    let outputComp = (
      <div dangerouslySetInnerHTML={{ __html: this.outputData }} />
    );
    return outputComp;
  }
  protected render(): React.ReactElement<any> {
    const title = this.generate_title();
    console.log('51\n');
    const output = this.generate_output();
    console.log('67', title);
    return (
      <React.Fragment>
        <body>
          <div className="body1">{title}</div>
          <div className="body2">{output}</div>
          <div className="body3">{title}</div>
        </body>
      </React.Fragment>
    );
  }
}
