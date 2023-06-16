import { defineStore } from "pinia";

export const useDataStore = defineStore("data", {
  state: () => ({
    user: null as User | null,
    isLoggedIn: false,
    projects: null as Project[] | null,
    announcement: null as Announcement[] | null,
    selectedProject: null as Project | null,
    previousPage: "",
  }),
  getters: {
    getUserId: (state) => state.user?.id,
    getUserName: (state) => state.user?.name,
    logInStatus: (state) => state.isLoggedIn,
    getSelectedProject: (state) => state.selectedProject,
    getAllProjects: (state) => state.projects,
    getPreviousPage: (state) => state.previousPage,
  },
  actions: {
    createUser(user: User) {
      this.user = user;
      console.log(user);
    },
    logIn() {
      this.isLoggedIn = true;
    },
    logOut() {
      this.isLoggedIn = false;
    },
    createProject(project: Project) {
      console.log(project);
      if (!this.projects) this.projects = [];
      this.projects.push(project);
      //   console.log("e", this.projects);
    },
    createAnnouncement(announcement: Announcement) {
      console.log(announcement);
      if (!this.announcement) this.announcement = [];
      this.announcement.push(announcement);
      //   console.log("a", this.projects);
    },
    updateUserInfo(key: string, value: any) {
      this.user ? ([key as keyof typeof this.user] = value) : this.user;
    },
    updateProject(projectId: string, key: string, value: any) {
      let project = this.getProject(projectId);
      project ? ([key as keyof typeof project] = value) : project;
    },
    getProject(projectId: string) {
      return this.projects?.filter((project) => {
        return project.id == projectId;
      })[0];
    },
    getUserInfo(userId: string, key: string) {
      return this.user ? [key] : this.user;
    },
    getUserRole() {
      return this.projects?.filter((project) => {
        return project.id == this.selectedProject?.id;
      })[0].role;
    },
    getFullData() {
      return [
        this.user,
        this.projects,
        this.announcement,
        this.selectedProject,
      ];
    },
    setPreviousPage(page: string) {
      this.previousPage = page;
    },
    setSelectedProject(id: string) {
      const project = this.getProject(id);
      this.selectedProject = project ? project : null;
    },
    clearData() {
      this.user = null;
      this.projects = null;
      this.announcement = null;
    },
    logout() {
      this.clearData();
      this.selectedProject = null;
    },
  },
});

interface User {
  id: string;
  name: string;
  contact_number: string;
  email: string;
  working_hour: string[];
  avatar_url: string;
}

interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  creator_id: string;
  is_show_project_in_overview: boolean;
  //   tasks: [{
  //     id: string;
  //     name: string;
  //     description: string;
  //     task_creator_id: string;
  //     task_creation_date_time: string;
  //     task_owner_ids: string[];
  //     task_due_date: string;
  //     task_due_time: string;
  //     task_importance: number;
  //     task_urgent_date: string;
  //     task_status: string;
  //   }];
}

interface Overview {
  id: string;
  filter_task_due_period: string;
  is_show_my_tasks_only: true;
  is_show_completed: true;
}

interface Announcement {
  id: string;
  name: string;
  project_id: string;
  creator_id: string;
  creation_date_time: string;
  description: string;
  receiver_id: string[];
}
