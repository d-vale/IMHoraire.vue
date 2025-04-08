<script setup>
import { defineProps, defineEmits, ref, computed, onMounted } from "vue";

const props = defineProps({
  drawerOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:drawerOpen", "classSelected"]);

// Référence pour stocker les données récupérées de l'API
const scheduleData = ref([]);

// Charger les données depuis l'API distante
onMounted(async () => {
  try {
    const response = await fetch('https://chabloz.eu/files/horaires/all');
    scheduleData.value = await response.json();
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
});

// Extraire les classes uniques des données récupérées
const availableClasses = computed(() => {
  const classSet = new Set();

  scheduleData.value.forEach((item) => {
    if (item.class) {
      classSet.add(item.class);
    }
  });

  // Convertir en tableau et trier
  return Array.from(classSet).sort();
});

// Référence pour la classe actuellement sélectionnée
const selectedClass = ref("all");

// Fonction pour sélectionner une classe
function selectClass(className) {
  selectedClass.value = className;
  emit("classSelected", className);
}
</script>

<template>
  <q-drawer
    :model-value="drawerOpen"
    @update:model-value="$emit('update:drawerOpen', $event)"
    show-if-above
    bordered
    content-class="bg-grey-1"
  >
    <q-list>
      <q-item-label header class="text-grey-8">Classes</q-item-label>

      <!-- Option pour voir toutes les classes -->
      <q-item
        clickable
        v-ripple
        :active="selectedClass === 'all'"
        @click="selectClass('all')"
        active-class="bg-primary text-white"
      >
        <q-item-section avatar>
          <q-icon name="group" />
        </q-item-section>
        <q-item-section>Toutes les classes</q-item-section>
      </q-item>

      <!-- Liste des classes dynamique -->
      <q-item
        v-for="className in availableClasses"
        :key="className"
        clickable
        v-ripple
        :active="selectedClass === className"
        @click="selectClass(className)"
        active-class="bg-primary text-white"
      >
        <q-item-section avatar>
          <q-icon name="class" />
        </q-item-section>
        <q-item-section>{{ className }}</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<style scoped>
.q-item--active {
  font-weight: bold;
}
</style>
