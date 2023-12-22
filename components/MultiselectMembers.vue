<template>
  <!-- <Pmultiselect
    :options="groupedUsers"
    optionLabel="username"
    optionValue="user_id"
    optionGroupLabel="department"
    filter
    optionGroupChildren="members"
    display="chip"
    placeholder="Assign Task to"
    class="w-full"
  >
    <template #optiongroup="slotProps">
      <div class="flex align-items-center">
        <div>{{ slotProps.option.department }}</div>
      </div>
    </template>
  </Pmultiselect> -->

</template>

<script setup>
defineProps(["groupedUsers", "selectedUsers"]);

</script>

<style lang="scss" scoped></style>
