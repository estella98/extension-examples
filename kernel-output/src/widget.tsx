import {
  ReactWidget, //,
  // UseSignal
} from '@jupyterlab/apputils';
import { CodeCell, MarkdownCell } from '@jupyterlab/cells';
import * as React from 'react';
import '../style/index.css';

import { JupyterFrontEnd } from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook';
import { model } from './index';

export class KernelView extends ReactWidget {
  titleStr: String;
  codeOutput: any[] = [];
  markDownOutput: any[] = [];
  presentMode: String;
  constructor(
    app: JupyterFrontEnd,
    tracker: INotebookTracker,
    titleStr: string = 'DEFAULT TITLE'
    // rendermime: IRenderMimeRegistry,
    // translator?: ITranslator
  ) {
    super();
    this.titleStr = titleStr;
    this.presentMode = 'p0';
  }

  generate_title() {
    let titleComp = (
      <div className={'presentation-title'}>
        <h1>{this.titleStr}</h1>
      </div>
    );
    return titleComp;
  }

  identify_template() {
    let presentDict: { [name: string]: number } = {};
    presentDict.code = 0;
    presentDict.markdown = 0;
    presentDict.raw = 0;
    console.log('widget.ts: kernel constructor called', model);
    model.selectedNodes.forEach((element, index, array) => {
      console.log('each element', element.model.type);
      switch (element.model.type) {
        case 'code':
          presentDict.code += 1;
          console.log('code cell', (element as CodeCell).outputArea);
          this.codeOutput.push((element as CodeCell).outputArea);

          break;
        case 'markdown':
          presentDict.markdown += 1;
          console.log('markdown cell', element as MarkdownCell);
          this.markDownOutput.push(element as MarkdownCell);
          break;
        case 'raw':
          presentDict.raw += 1;
          break;
        default:
          console.log('default');
      }
    });
    // switch template
    if (
      presentDict.code == 1 &&
      presentDict.markdown == 0 &&
      presentDict.raw == 0
    ) {
      this.presentMode = 'p1';
    }
    if (
      presentDict.code == 1 &&
      presentDict.markdown == 1 &&
      presentDict.raw == 0
    ) {
      this.presentMode = 'p2';
    }
  }

  // generate_output() {
  //   console.log('41\n', this.outputData);
  //   let outputComp = (
  //     <div dangerouslySetInnerHTML={{ __html: this.outputData }} />
  //   );
  //   return outputComp;
  // }
  protected render(): React.ReactElement<any> {
    this.identify_template();
    const title = this.generate_title();
    if (this.presentMode == 'p1') {
      return (
        <React.Fragment>
          <body className="mainPanel">
            <div className="body1">{title}</div>
            <div className="body2">
              {
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.codeOutput[0].node.innerHTML,
                  }}
                />
              }
            </div>
            <div className="body3">body text annotation</div>
          </body>
        </React.Fragment>
      );
    } else if (this.presentMode == 'p2') {
      return (
        <React.Fragment>
          <body className="mainPanel">
            <div className="body1">{title}</div>
            <div className="horizontalGroup">
              <div className="body2">
                {
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.codeOutput[0].node.innerHTML,
                    }}
                  />
                }
              </div>
              <div className="body3">
                {
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.markDownOutput[0].node.innerHTML,
                    }}
                  />
                }
              </div>
            </div>
          </body>
        </React.Fragment>
      );
    }
  }
}
