import { defineStore } from "pinia";

export const useDataStore = defineStore("data", {
  state: () => ({
    user: null as User | null,
    isLoggedIn: false,
    events: null as Event[] | null,
    announcement: null as Announcement[] | null,
    selectedEvent: "",
    previousPage: "",
  }),
  getters: {
    getUserId: (state) => state.user?.id,
    getUserName: (state) => state.user?.name,
    logInStatus: (state) => state.isLoggedIn,
    getSelectedEvent: (state) => state.selectedEvent,
    getAllEvents: (state) => state.events,
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
    createEvent(event: Event) {
      console.log(event);
      if (!this.events) this.events = [];
      this.events.push(event);
      //   console.log("e", this.events);
    },
    createAnnouncement(announcement: Announcement) {
      console.log(announcement);
      if (!this.announcement) this.announcement = [];
      this.announcement.push(announcement);
      //   console.log("a", this.events);
    },
    updateUserInfo(key: string, value: any) {
      this.user ? ([key as keyof typeof this.user] = value) : this.user;
    },
    updateEvent(eventId: string, key: string, value: any) {
      let event = this.getEvent(eventId);
      event ? ([key as keyof typeof event] = value) : event;
    },
    getEvent(eventId: string) {
      return this.events?.filter((event) => {
        return event.id == eventId;
      })[0];
    },
    getUserInfo(userId: string, key: string) {
      return this.user ? [key] : this.user;
    },
    getUserRole() {
      return this.events?.filter((event) => {
        return event.id == this.selectedEvent;
      })[0].role;
    },
    getFullData() {
      return [this.user, this.events, this.announcement];
    },
    setPreviousPage(page: string) {
      this.previousPage = page;
    },
    clearData() {
      this.user = null;
      this.events = null;
      this.announcement = null;
    },
    logout() {
      this.clearData();
      this.selectedEvent = "";
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

interface Event {
  id: string;
  name: string;
  role: string;
  description: string;
  creator_id: string;
  is_show_event_in_overview: boolean;
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
  event_id: string;
  creator_id: string;
  creation_date_time: string;
  description: string;
  receiver_id: string[];
}
