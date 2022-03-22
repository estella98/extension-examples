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
import { ICodeCellModel } from '@jupyterlab/cells';
import { ExamplePanel } from './panel';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import { ToolbarButton } from '@jupyterlab/apputils';

import {
  //NotebookActions,
  NotebookPanel,
  INotebookModel,
} from '@jupyterlab/notebook';

/**
 * The command IDs used by the console plugin.
 */
namespace CommandIDs {
  export const create = 'kernel-output:create';

  export const execute = 'kernel-output:execute';
}

/**
 * Initialization data for the extension.
 */
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
  const manager = app.serviceManager;
  const { commands, shell } = app;
  const category = 'Extension Examples';
  const trans = translator.load('jupyterlab');

  let panel: ExamplePanel;

  /**
   * Creates a example panel.
   *
   * @returns The panel
   */
  async function createPanel(): Promise<ExamplePanel> {
    panel = new ExamplePanel(
      app,
      notebookTracker,
      manager,
      rendermime,
      translator
    );
    shell.add(panel, 'main');
    return panel;
  }

  // add commands to registry
  commands.addCommand(CommandIDs.create, {
    label: trans.__('Open the Presentation Kernel'),
    caption: trans.__('Open the Presentation Kernel'),
    execute: createPanel,
  });

  // commands.addCommand(CommandIDs.execute, {
  //   label: trans.__('Contact Kernel and Execute Code'),
  //   caption: trans.__('Contact Kernel and Execute Code'),
  //   execute: async () => {
  //     // Create the panel if it does not exist
  //     if (!panel) {
  //       await createPanel();
  //     }
  //     // Prompt the user about the statement to be executed
  //     const input = await InputDialog.getText({
  //       title: trans.__('Code to execute'),
  //       okLabel: trans.__('Execute'),
  //       placeholder: trans.__('Statement to execute'),
  //     });
  //     // Execute the statement
  //     if (input.button.accept) {
  //       const code = input.value;
  //       panel.execute(code);
  //     }
  //   },
  // });

  // add items in command palette and menu
  [CommandIDs.create, CommandIDs.execute].forEach((command) => {
    palette.addItem({ command, category });
  });

  // Add launcher
  if (launcher) {
    launcher.add({
      command: CommandIDs.create,
      category: category,
    });
  }

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

const plugin: JupyterFrontEndPlugin<void> = {
  activate,
  id: 'toolbar-button',
  autoStart: true,
};

// add new change experiments
export class ButtonExtension2
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
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

const copyOutputPlugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab/notebook-extension:copy-output',
  activate: activateCopyOutput,
  requires: [ITranslator, INotebookTracker],
  autoStart: true,
};

function activateCopyOutput(
  app: JupyterFrontEnd,
  notebookTracker: INotebookTracker
) {
  console.log('activate Copy Output is called');
  if (notebookTracker.activeCell) {
    let codeCell = notebookTracker.activeCell.model as ICodeCellModel;
    console.log(codeCell);
    let outputs = codeCell.outputs;
    console.log(outputs);
    for (let i = 0; i < outputs.length; i++) {
      // IOutputModel
      const outputModel = outputs.get(i);
      const outputData = outputModel.data;
      console.log('\t\tdata is', outputData);
      // also has `outputModel.executionCount` and `outputModel.metadata`
    }
  }

  notebookTracker.widgetUpdated.connect((tracker, panel) => {
    console.log('widget is updated');
    console.log(panel.model.cells);
    let notebook = panel.content;
    const notebookModel = notebook.model;
    console.log('notebook model is');
    console.log(notebookModel);
    notebookModel.cells.changed.connect((_, change) => {
      if (change.type != 'add') {
        return;
      }
      for (const cellModel of change.newValues) {
        // ensure we have CodeCellModel
        if (cellModel.type != 'code') {
          return;
        }
        // IOutputAreaModel
        let outputs = (cellModel as ICodeCellModel).outputs;
        console.log('outputs are');
        console.log(outputs);
        if (!outputs) {
          continue;
        }
        outputs.changed.connect(() => {
          console.log(
            'Outputs of the cell',
            cellModel.id,
            'in',
            notebook.title.label,
            'changed:'
          );
          console.log('\tThere are now', outputs.length, 'outputs:');
          for (let i = 0; i < outputs.length; i++) {
            // IOutputModel
            const outputModel = outputs.get(i);
            console.log('\t\t', outputModel.data);
            // also has `outputModel.executionCount` and `outputModel.metadata`
          }
        });
      }
    });
  });
}

export default extension;
export { plugin, copyOutputPlugin };
