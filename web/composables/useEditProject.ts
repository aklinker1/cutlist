export default function () {
  const { openDialog } = useDialogState();
  const allProjects = useProjects();

  const openExistingProject = (project: Project) =>
    new Promise<Project>((res, rej) => {
      openDialog('add-project', {
        title: 'Edit Project',
        defaults: project,
        onAdd: res,
        onCancel: () => rej(Error('Canceled')),
      });
    });

  return async (project: Project | undefined) => {
    if (project == null) return;

    const newProject = await openExistingProject(project);
    allProjects.value = allProjects.value.map((p) =>
      p.id === newProject.id ? newProject : p,
    );
  };
}
