import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ICommandPalette, InputDialog } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { ITranslator } from '@jupyterlab/translation';

import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

import { ExamplePanel } from './panel';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import { ToolbarButton } from '@jupyterlab/apputils';

import {
  NotebookActions,
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
  requires: [ICommandPalette, IRenderMimeRegistry, ITranslator],
  activate: activate,
};

/**
 * Activate the JupyterLab extension.
 *
 * @param app Jupyter Front End
 * @param palette Jupyter Commands Palette
 * @param rendermime Jupyter Render Mime Registry
 * @param translator Jupyter Translator
 * @param launcher [optional] Jupyter Launcher
 */
function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  rendermime: IRenderMimeRegistry,
  translator: ITranslator,
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
    panel = new ExamplePanel(manager, rendermime, translator);
    shell.add(panel, 'main');
    return panel;
  }

  // add commands to registry
  commands.addCommand(CommandIDs.create, {
    label: trans.__('Open the Kernel Output Panel'),
    caption: trans.__('Open the Kernel Output Panel'),
    execute: createPanel,
  });

  commands.addCommand(CommandIDs.execute, {
    label: trans.__('Contact Kernel and Execute Code'),
    caption: trans.__('Contact Kernel and Execute Code'),
    execute: async () => {
      // Create the panel if it does not exist
      if (!panel) {
        await createPanel();
      }
      // Prompt the user about the statement to be executed
      const input = await InputDialog.getText({
        title: trans.__('Code to execute'),
        okLabel: trans.__('Execute'),
        placeholder: trans.__('Statement to execute'),
      });
      // Execute the statement
      if (input.button.accept) {
        const code = input.value;
        panel.execute(code);
      }
    },
  });

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

  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension2());
}
const plugin: JupyterFrontEndPlugin<void> = {
  activate,
  id: 'toolbar-button',
  autoStart: true,
};

// add new change experiments
export class ButtonExtension2
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  /**
   * Create a new extension for the notebook panel widget.
   *
   * @param panel Notebook panel
   * @param context Notebook context
   * @returns Disposable on the added button
   */
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    const genSlide = () => {
      NotebookActions.clearAllOutputs(panel.content);
    };
    const button = new ToolbarButton({
      className: 'slide-gen-buutton',
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






export default extension;
export {plugin};


