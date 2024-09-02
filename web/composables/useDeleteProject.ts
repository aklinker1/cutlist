import useInvalidateProjectListQuery from './useInvalidateProjectListQuery';

export default function () {
  const account = useAccountService();
  const closeTab = useCloseTab();
  const invalidateProjectsQuery = useInvalidateProjectListQuery();

  return async (id: string) => {
    await account.value.removeProject(id);
    await invalidateProjectsQuery();
    closeTab(id);
  };
}
