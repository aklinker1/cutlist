export default function () {
  const projects = useProjects();
  const closeTab = useCloseTab();

  return (id: string) => {
    closeTab(id);
    projects.value = projects.value.filter((project) => project.id !== id);
  };
}
