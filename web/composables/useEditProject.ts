export default function () {
  const { openDialog } = useDialogState();
  const account = useAccountService();
  const invalidateProjectsQuery = useInvalidateProjectListQuery();

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
    await account.value.saveProject(newProject);
    await invalidateProjectsQuery();
  };
}
