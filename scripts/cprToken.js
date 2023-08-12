class CyberpunkRedLoadoutsToken extends window.LoadoutsRegistry.tokenClass {
    defineToken() {
        super.defineToken();  // This calls the defineToken method of LoadoutsToken

        // We will set the token's disposition value based on the item's quality
        const dispositionMap = {
            "poor": -1, 
            "standard": 0, 
            "excellent": 1
        }    
        const statusIconMap = {
            "equipped": "modules/loadouts/artwork/icons/status-equipped.webp",
            "carried": "",
            "owned": ""
        }

        // Set the token's 'health' bar to represent magazine contents, if available
        // TODO: Look at giving each weapon actor one of its own items in its inventory; then we can use the
        //// magazine attribute to fill the bars instead of hijacking hp
        if(("magazine" in this.itemDocument.system) && (this.itemDocument.system.magazine.max != 0)){
            this.itemTokenSettings.displayBars = 50;  // Set visibility for the 'hp' bar
            this.itemTokenSettings.actorData = {
                system: {
                    derivedStats: {
                        hp: {
                            max: itemDocument.system.magazine.max,
                            value: itemDocument.system.magazine.value
                        }
                    }
                }
            }
        }

        // Set equipped state overlays where desired
        if(this.itemDocument.system.equipped){
            this.itemTokenSettings.overlayEffect = statusIconMap[itemDocument.system.equipped]
        }
    }
}

Hooks.on('loadoutsReady', function() {
    // Now you can safely register with LoadoutsRegistry or perform other setup tasks
    console.log("Loaded Cyberpunk Red Loadouts module")
    LoadoutsRegistry.registerTokenClass("cyberpunk-red-core", CyberpunkRedLoadoutsToken);
});