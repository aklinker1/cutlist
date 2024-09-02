export default function () {
  const { openDialog } = useDialogState();
  const openProjectIds = useOpenProjectIds();
  const router = useRouter();
  const accountService = useAccountService();

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
    await accountService.value.saveProject(project);
    openProjectIds.value.push(project.id);
    router.push(`/p/${project.id}`);
  };
}
