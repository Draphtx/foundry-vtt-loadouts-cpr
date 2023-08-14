import { statusIconMap } from './constants.js';

Hooks.on('loadoutsReady', function() {
    class CyberpunkRedLoadoutsToken extends LoadoutsRegistry.tokenClasses.default {
        defineToken() {
            super.defineToken();  // This calls the defineToken method of LoadoutsToken
            console.log("Preparing CPR item")

            // Set the token's 'health' bar to represent magazine contents, if available and desired
            if(this.itemDocument.flags?.loadouts?.stack?.max > 1){
                this.itemTokenSettings.displayBars = game.settings.get("loadouts-cpr", "loadouts-cpr-show-stack-bar") ? 50 : 0, // Set visibility for the 'hp' bar
                this.itemTokenSettings.actorData = {
                    system: {
                        derivedStats: {
                            hp: {
                                max: this.itemDocument.system.magazine.max,
                                value: this.itemDocument.system.magazine.value
                            }
                        }
                    }
                }
            } else {
                if(("magazine" in this.itemDocument.system) && (this.itemDocument.system.magazine.max != 0)){
                    this.itemTokenSettings.displayBars = game.settings.get("loadouts-cpr", "loadouts-cpr-show-ammo-bar") ? 50 : 0,
                    this.itemTokenSettings.actorData = {
                        system: {
                            derivedStats: {
                                hp: {
                                    max: this.itemDocument.system.magazine.max,
                                    value: this.itemDocument.system.magazine.value
                                }
                            }
                        }
                    }
                }
        
                // Set equipped state overlays where desired
                if(this.itemDocument.system.equipped){
                    this.itemTokenSettings.overlayEffect = statusIconMap[this.itemDocument.system.equipped]
                }
            }
        }
    }

    // Now you can safely register with LoadoutsRegistry or perform other setup tasks
    console.log("%c▞▖Loadouts CPR: loaded Cyberpunk Red Loadouts module", 'color:#ff4bff')
    window.LoadoutsRegistry.registerTokenClass("cyberpunk-red-core", CyberpunkRedLoadoutsToken);
});

Hooks.on("updateItem", (document, options, userid) => updateCPRToken(document));

async function updateCPRToken(itemDocument){
    // When items are updated in the backend, we don't need to worry about them
    if((itemDocument.parent == null) || (itemDocument.parent == undefined)){ return; }
    
    // Don't bother with items that have not been linked to a loadout token
    if(itemDocument?.flags?.loadouts?.configured !== true){ return; }
    
    const loadoutsScenes = game.scenes.filter(
        scene => scene.flags.loadouts).filter(
            scene => scene.flags.loadouts.isLoadoutsScene == true)
    
    var loadoutsItemToken = undefined
    for(const loadoutsScene of loadoutsScenes){
        loadoutsItemToken = game.scenes.get(loadoutsScene.id).tokens.contents.find(token => 
            token.flags.loadouts?.stack?.members?.includes(itemDocument.id))
        if(loadoutsItemToken){
            break;
        }
    }

    if((loadoutsItemToken == null) || (loadoutsItemToken == undefined)){
        console.warn("▞▖Loadouts CPR: Loadouts item not found; cannot reflect " + itemDocument.parent.name + "'s inventory change")
        return;
    }

    // Use the token's health bar to represent stack amount, if item is stackable
    if(itemDocument.flags?.loadouts?.stack?.max > 1){
        loadoutsItemToken.update({
            actorData: {
                system: {
                    derivedStats: {
                        hp: {
                            value: itemDocument.flags.loadouts.stack.members.length
                        }
                    }
                }
            }
        })
    } else if(itemDocument.system.magazine.max != 0){
        loadoutsItemToken.update({
            actorData: {
                system: {
                    derivedStats: {
                        hp: {
                            value: itemDocument.system.magazine.value
                        }
                    }
                }
            }
        })
    }
    
    // Update the linked token's overlay if the item is equipped
    console.debug("▞▖Loadouts CPR: changing equip status")
    if(itemDocument.system.equipped){
        loadoutsItemToken.update({
            overlayEffect: statusIconMap[itemDocument.system.equipped]
        })
    }

    Hooks.off("updateItem");
    return;
}