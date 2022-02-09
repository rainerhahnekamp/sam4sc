import { virtualFs, workspaces } from '@angular-devkit/core';
import { SchematicsException, Tree } from '@angular-devkit/schematics';

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
      }
      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    }
  };
}

export async function getProjectPath(tree: Tree, projectName: string | undefined) {
  const host = createHost(tree);

  const { workspace } = await workspaces.readWorkspace('/', host);

  if (!projectName && typeof workspace.extensions.defaultProject === 'string') {
    projectName = workspace.extensions.defaultProject;
  }

  const project = projectName != null ? workspace.projects.get(projectName) : null;
  if (!project) {
    throw new SchematicsException(`Invalid project name: ${projectName}`);
  }

  if (project.sourceRoot === undefined) {
    throw new SchematicsException(`No sourceroot for: ${projectName}`);
  }

  const subDir = project.extensions.projectType === 'application' ? 'app' : 'lib';

  return `${project.sourceRoot}/${subDir}`;
}
