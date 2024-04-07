export default function () {
  const closeTab = useCloseTab();
  const projects = useProjects();

  return (id: string) => {
    closeTab(id);
    projects.value = projects.value.filter((project) => project.id !== id);
  };
}
