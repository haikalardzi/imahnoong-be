class DataCache {
    constructor() {
        this.currentData = null;
        this.selectedIndex = 0;
        this.astroAPIData = null;
        this.lastUpdated = null;
    }

    setCurrentData(data, index) {
        this.currentData = data;
        this.selectedIndex = index;
        this.lastUpdated = new Date();
        console.log('Cache updated:', { data, index, timestamp: this.lastUpdated });
    }

    getCurrentData() {
        return {
            data: this.currentData,
            selectedIndex: this.selectedIndex,
            lastUpdated: this.lastUpdated
        };
    }

    setAstroAPIData(data) {
        this.astroAPIData = data;
    }

    getAstroAPIData() {
        return this.astroAPIData;
    }
}

// Create singleton instance
const cache = new DataCache();
export default cache;