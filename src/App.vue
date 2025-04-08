<script setup>
import { ref } from "vue";
import TheHeader from "./components/TheHeader.vue";
import TheNav from "./components/TheNav.vue";
import TheSchedule from "./components/TheSchedule.vue";

const leftDrawerOpen = ref(false);
const selectedClass = ref('all');

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const handleClassSelected = (className) => {
  selectedClass.value = className;
};
</script>

<template>
  <q-layout view="hHh LpR fFf">
    <TheHeader @toggle-drawer="toggleLeftDrawer" />
    <TheNav
      :drawer-open="leftDrawerOpen"
      @update:drawer-open="leftDrawerOpen = $event"
      @class-selected="handleClassSelected"
    />
    <TheSchedule :selected-class="selectedClass" />
  </q-layout>
</template> 

<style scoped>
.q-toolbar-title {
  text-align: center;
}
</style>
