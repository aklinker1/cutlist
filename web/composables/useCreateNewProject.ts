export default function () {
  const { openDialog } = useDialogState();
  const openProjectIds = useOpenProjectIds();
  const allProjects = useProjects();
  const router = useRouter();

  const createNewProject = () =>
    new Promise<Project>((res, rej) => {
      openDialog('add-project', {
        title: 'New Project',
        onAdd: res,
        onCancel: () => rej(Error('Canceled')),
      });
    });

  return async () => {
    const project = await createNewProject();
    allProjects.value.push(project);
    openProjectIds.value.push(project.id);
    router.push(`/p/${project.id}`);
  };
}
