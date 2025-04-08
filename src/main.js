import { createApp } from 'vue';
import { Quasar } from 'quasar';

import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/dist/quasar.css';

import App from './App.vue';

const myApp = createApp(App);

myApp.use(Quasar, {
    config: {
        brand: {
            primary: '#ff4f4f',
            secondary: '#7d7d7d',
            accent: '#ff0000',

            dark: '#000000',
            'dark-page': '#212121',

            positive: '#21BA45',
            negative: '#C10015',
            info: '#32b2ed',
            warning: '#ffd152'
        }
    },
    plugins: {},
});

myApp.mount('#app');
// Mettre ce code à la fin de votre fichier main.js

// Enregistrement du service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker enregistré avec succès:', registration.scope);
            })
            .catch(error => {
                console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
            });
    });
} else {
    console.log('Les Service Workers ne sont pas supportés par ce navigateur');
}