<script setup>
 import { computed, ref, watch, onMounted } from "vue";
 
 // Modifier le nom et la valeur par défaut (true pour n'afficher que les cours futurs)
 const showAllCourses = ref(false);
 
 // Ajouter une prop pour recevoir la classe sélectionnée
 const props = defineProps({
   selectedClass: {
     type: String,
     default: 'all'
   }
 });
 
 // Référence pour stocker les données du planning
 const schedule = ref([]);

 // Charger les données depuis l'API distante
 onMounted(async () => {
   try {
     const response = await fetch('https://chabloz.eu/files/horaires/all');
     schedule.value = await response.json();
   } catch (error) {
     console.error('Erreur lors du chargement des données:', error);
   }
 });
 
 // Fonction pour formater la date (heure)
 function formatDate(dateStr) {
   if (!dateStr) return '-';
   const date = new Date(dateStr);
   return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
 }

 // Fonction pour obtenir le jour de la semaine
 function getDayOfWeek(dateStr) {
   if (!dateStr) return '-';
   const date = new Date(dateStr);
   const days = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
   return days[date.getDay()];
 }
 
 // Fonction pour formater la date complète (JJ.MM.YYYY)
 function formatCompleteDate(dateStr) {
   if (!dateStr) return '-';
   const date = new Date(dateStr);
   return date.toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
 }
 
 // Préparation des données pour le tableau (avec tri par date)
 const tableData = computed(() => {
   // Filtrer les éléments valides
   const filteredItems = schedule.value.filter(item => item.start && item.end && item.class && item.label);
   
   // Filtrer par classe si une classe spécifique est sélectionnée
   const classFilteredItems = props.selectedClass === 'all' 
     ? filteredItems 
     : filteredItems.filter(item => item.class === props.selectedClass);
   
   // Inverser le filtre : par défaut (sans cocher) n'afficher que les cours actuels ou futurs
   const currentDate = new Date();
   const currentOrFutureItems = showAllCourses.value 
     ? classFilteredItems
     : classFilteredItems.filter(item => new Date(item.end) > currentDate);
   
   // Trier par date de début (ordre chronologique)
   const sortedItems = [...currentOrFutureItems].sort((a, b) => {
     const dateA = new Date(a.start);
     const dateB = new Date(b.start);
     return dateA - dateB; // Toujours du plus ancien au plus récent
   });
   
   // Mapper les données pour l'affichage
   return sortedItems.map(item => {
     return {
       id: item.id,
       jourDate: {
         jour: getDayOfWeek(item.start),
         date: formatCompleteDate(item.start)
       },
       horaire: {
         debut: formatDate(item.start),
         fin: formatDate(item.end)
       },
       cours: item.label,
       classe: item.class,
       salle: item.room || '-',
       // Conserver la date brute pour le tri
       rawDate: new Date(item.start)
     };
   });
 });

 // Définition des colonnes pour le tableau
 const columns = [
   {
     name: "jourDate",
     required: true,
     label: "Jour / Date",
     align: "left",
     field: "jourDate",
     sortable: true
   },
   {
     name: "horaire",
     align: "center",
     label: "Horaire",
     field: "horaire",
     sortable: true
   },
   {
     name: "cours",
     align: "left",
     label: "Cours",
     field: "cours",
     sortable: true
   },
   {
     name: "classe",
     align: "center",
     label: "Classe",
     field: "classe",
     sortable: true
   },
   {
     name: "salle",
     align: "center",
     label: "Salle",
     field: "salle",
     sortable: true
   }
 ];
</script>

<template>
  <q-page-container>
    <q-page padding>
      <div class="q-pa-md">
        <h5 class="q-mt-none q-mb-md">Tableau des horaires</h5>
        
        <!-- Modifier le libellé de la case à cocher -->
        <div class="q-mb-md">
          <q-checkbox
            v-model="showAllCourses"
            label="Afficher aussi les cours passés (historique)"
            color="primary"
          />
        </div>

        <q-table
          title="Horaires des cours"
          :rows="tableData"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 15 }"
          flat
          bordered
        >
          <!-- Template personnalisé pour la colonne Jour/Date -->
          <template v-slot:body-cell-jourDate="props">
            <q-td :props="props">
              <div class="text-subtitle1">{{ props.value.jour }}</div>
              <div class="text-caption">{{ props.value.date }}</div>
            </q-td>
          </template>

          <!-- Template personnalisé pour la colonne Horaire -->
          <template v-slot:body-cell-horaire="props">
            <q-td :props="props">
              <div>{{ props.value.debut }} - {{ props.value.fin }}</div>
            </q-td>
          </template>
        </q-table>
      </div>
    </q-page>
  </q-page-container>
</template>

<style scoped>
.text-subtitle1 {
  font-weight: 500;
}
.text-caption {
  color: #666;
}
</style>