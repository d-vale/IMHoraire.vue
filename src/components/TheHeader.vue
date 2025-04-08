<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["toggle-drawer"]);

const handleToggleDrawer = () => {
  emit("toggle-drawer");
};
</script>

<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="handleToggleDrawer"
      />

      <q-toolbar-title class="text-center">
        Horraire HEIG-VD
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<style scoped></style>
