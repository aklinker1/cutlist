export default function () {
  const { openDialog } = useDialogState();
  const openProjectIds = useOpenProjectIds();
  const allProjects = useProjects();
  const router = useRouter();

  const openExistingProject = (project: Project) =>
    new Promise<Project>((res, rej) => {
      openDialog('add-project', {
        title: 'Edit Project',
        defaults: project,
        onAdd: res,
        onCancel: () => rej(Error('Canceled')),
      });
    });

  return async (project: Project) => {
    const newProject = await openExistingProject(project);
    allProjects.value = allProjects.value.map((p) =>
      p.id === newProject.id ? newProject : p,
    );
  };
}
