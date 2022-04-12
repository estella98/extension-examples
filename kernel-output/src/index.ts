import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

//import { ICommandPalette, InputDialog } from '@jupyterlab/apputils';
import { ICommandPalette } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';

import { ITranslator } from '@jupyterlab/translation';
import { INotebookTracker } from '@jupyterlab/notebook';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { ExamplePanel } from './panel';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import { ToolbarButton } from '@jupyterlab/apputils';
import { footerButtonExtension, cellFactory } from './footer_button';
import { NodeModel } from './node_model';
import {
  //NotebookActions,
  NotebookPanel,
  INotebookModel,
} from '@jupyterlab/notebook';

/**
 * Initialization data for the extension.
 */

// declare global instance of nodeModel( BackEnd)
export const model = new NodeModel();

const extension: JupyterFrontEndPlugin<void> = {
  id: 'kernel-output',
  autoStart: true,
  optional: [ILauncher],
  requires: [
    ICommandPalette,
    IRenderMimeRegistry,
    ITranslator,
    INotebookTracker,
  ],
  activate: activate,
};

/**
 * Activate the JupyterLab extension.
 *
 * @param app Jupyter Front End
 * @param palette Jupyter Commands Palette
 * @param rendermime Jupyter Render Mime Registry
 * @param translator Jupyter Translator
 * @param notebookTracker notebookTracker
 * @param launcher [optional] Jupyter Launcher
 */
function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  rendermime: IRenderMimeRegistry,
  translator: ITranslator,
  notebookTracker: INotebookTracker,
  launcher: ILauncher | null
): void {
  app.docRegistry.addWidgetExtension(
    'Notebook',
    new ButtonExtension2(
      app,
      palette,
      rendermime,
      translator,
      notebookTracker,
      launcher
    )
  );
}

// add new change experiments
export class ButtonExtension2
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  /**
   * Create a new extension for the notebook panel widget.
   
   * @param panel Notebook panel
   * @param context Notebook context
   * @returns Disposable on the added button
   */
  app: JupyterFrontEnd = null;
  palette: ICommandPalette = null;
  rendermime: IRenderMimeRegistry = null;
  translator: ITranslator = null;
  notebookTracker: INotebookTracker;
  launcher: ILauncher | null;
  model: NodeModel;

  constructor(
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    rendermime: IRenderMimeRegistry,
    translator: ITranslator,
    notebookTracker: INotebookTracker,
    launcher: ILauncher | null
  ) {
    this.app = app;
    this.palette = palette;
    this.rendermime = rendermime;
    this.translator = translator;
    this.launcher = launcher;
    this.notebookTracker = notebookTracker;
  }

  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    const genSlide = () => {
      console.log(panel.content);
      let new_panel: ExamplePanel;
      const { shell } = this.app;
      let manager = this.app.serviceManager;
      new_panel = new ExamplePanel(
        this.app,
        this.notebookTracker,
        manager,
        this.rendermime,
        this.translator
      );
      shell.add(new_panel, 'main');
      return new_panel;
    };

    const button = new ToolbarButton({
      className: 'slide-gen-button',
      label: 'Generate Slide',
      onClick: genSlide,
      tooltip: 'Generate Slide',
    });

    panel.toolbar.insertItem(11, 'genSlide', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

// export default extension;
const plugins: Array<JupyterFrontEndPlugin<any>> = [
  footerButtonExtension,
  cellFactory,
  extension,
];

export default plugins;
