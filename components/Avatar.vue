<template>
  <Pavatar v-if="!props.hasProfile" class="profile" icon="pi pi-user" shape="circle" :pt="{
    icon: { style: 'font-size: 2.563rem' },
  }" />
  <Pavatar v-if="props.hasProfile" class="profile" image="https://www.imghippo.com/images/1704640025.jpg" shape="circle"
    :pt="{
      icon: { style: 'font-size: 2.563rem' },
    }" />
</template>

<script setup>
const props = defineProps(["hasProfile", "userId"]);
console.log(props.userId);
console.log(props.hasProfile)
</script>

<style lang="css" scoped>
.p-avatar.p-component.p-avatar-circle.profile {
  font-size: 5.125rem;
  width: 5.125rem;
  height: 5.125rem;
}
</style>
