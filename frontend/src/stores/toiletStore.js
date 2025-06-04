import { defineStore } from 'pinia';

const STORAGE_KEY = 'toilet_store';

export const useToiletStore = defineStore('toiletStore', {
  state: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          toilets: [
            { id: 1, name: '1번 화장실', available: true, tissue: true },
            { id: 2, name: '2번 화장실', available: true, tissue: true },
            { id: 3, name: '3번 화장실', available: true, tissue: true },
            { id: 4, name: '4번 화장실', available: true, tissue: true },
            { id: 5, name: '5번 화장실', available: true, tissue: true },
            { id: 6, name: '6번 화장실', available: true, tissue: true },
            { id: 7, name: '7번 화장실', available: true, tissue: true },
            { id: 8, name: '8번 화장실', available: true, tissue: true },
          ],
        };
  },
  actions: {
    toggleAvailability(id) {
      const index = this.toilets.findIndex(t => t.id === id);
      this.toilets[index] = {
        ...this.toilets[index],
        available: !this.toilets[index].available,
      };
      this.saveState();
    },
    toggleTissue(id) {
      const index = this.toilets.findIndex(t => t.id === id);
      this.toilets[index] = {
        ...this.toilets[index],
        tissue: !this.toilets[index].tissue,
      };
      this.saveState();
    },
    saveState() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state));
    },
  },
});