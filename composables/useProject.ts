export default function useCurrentProject() {
  const currentProject = useState<string>("project", () => "");

  function setCurrentProject(projectId: string) {
    currentProject.value = projectId;
    console.log("currentproject", currentProject.value);
  }

  return { currentProject, setCurrentProject };
}
