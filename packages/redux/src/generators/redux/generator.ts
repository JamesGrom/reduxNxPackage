import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import * as path from 'path';
import { ReduxGeneratorSchema } from './schema';
import { initGenerator } from '../init/init';

interface NormalizedSchema extends ReduxGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: ReduxGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default async function (tree: Tree, options: ReduxGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const tasks: GeneratorCallback[] = [];
  const initTask = await initGenerator(tree, {});
  tasks.push(initTask);
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@nrwl/js:tsc',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: `dist/libs/${normalizedOptions.projectName}`,
          tsConfig: `libs/${normalizedOptions.projectName}/tsconfig.lib.json`,
          packageJson: `libs/${normalizedOptions.projectName}/package.json`,
          main: `libs/${normalizedOptions.projectName}/src/index.ts`,
          assets: [],
        },
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
  return runTasksInSerial(...tasks);
}
