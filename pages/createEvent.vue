<template>
    <Ptoast />
    <div class="create-project flex align-items-center justify-content-center">
        <div id="create-project-1" class="h-screen flex align-items-center justify-item-center">
            <Pcard>
                <template #title>
                    <div class="flex">
                        <div class="flex justify-content-start">Project Details</div>
                    </div>
                </template>
                <template #subtitle> Please enter details for your project. </template>
                <template #content>
                    <div class="flex flex-column gap-5">
                        <div>
                            <span class="p-float-label">
                                <Pinputtext id="project-name" class="w-full" :class="{ 'p-invalid': invalidName }"
                                    v-model="projectName" type="text" required @blur="validate" />
                                <label for="project-name">Title</label>
                            </span>
                            <div class="flex justify-content-between">
                                <small>Short & unique is nice!</small>
                                <small class="invalid-input" v-if="invalidName">Invalid :(</small>
                            </div>
                        </div>
                        <div>
                            <span class="p-float-label">
                                <Ptextarea id="project-desc" v-model="projectDesc" type="text" autoResize rows="5"
                                    cols="30" />
                                <label for="project-desc">Description</label>
                            </span>
                            <small>What is this project about?</small>
                        </div>
                    </div>
                    <div class="flex justify-content-end align-content-end">
                        <Pbutton type="button" icon="pi pi-caret-right" aria-label="go-add-department" label="Create"
                            @click="createProject" />
                    </div>
                </template>
            </Pcard>
        </div>
    </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { useDataStore } from "~/stores/datastore";
import { refreshDatastore } from "./index.vue";

var projectName = ref();
var projectDesc = ref();
var invalidName = ref(false);
const toast = useToast();

const validate = () => {
    console.log("name", projectName.value);
    invalidName.value = projectName.value ? false : true;
    console.log(invalidName.value);
};

const createProject = async () => {
    console.log(projectName.value);
    if (!projectName.value) {
        console.log("notok");
        invalidName.value = true;
    } else {
        const createNewProject = {
            name: projectName.value,
            description: projectDesc.value ? projectDesc.value : "",
        };
        const { data: insertResponse } = await useFetch("api/new_project", {
            method: "POST",
            body: createNewProject,
            headers: { "cache-control": "no-cache" },
        });
        console.log(insertResponse);

        const createdProject = insertResponse.value.data;
        if (insertResponse.value.success) {
            const { data: mapResponse } = await useFetch("api/map_user_event", {
                method: "POST",
                body: {
                    id: createdProject.id,
                    name: createdProject.name,
                    role: "Admin",
                },
                headers: { "cache-control": "no-cache" },
            });

            console.log("map new event creator", mapResponse);
            if (mapResponse.value.success) {
                toast.add({
                    severity: "success",
                    summary: "Yay!",
                    detail: "The event is created. Edit the details in management page.",
                    lifetime: 1000,
                });

                refreshDatastore();
                console.log(useDataStore().getFullData());
                navigateTo(`/eventManagement/${createdProject.id}`);
            } else {
                toast.add({
                    severity: "danger",
                    summary: "Oops",
                    detail: "Error in creating event. Please try again later.",
                    lifetime: 1000,
                });
            }
        }
    }
};

definePageMeta({
    middleware: ["auth", "initiate"],
    layout: "custom",
});
</script>

<style lang="css" scoped>
.invalid-input {
    color: #c81111;
}
</style>
