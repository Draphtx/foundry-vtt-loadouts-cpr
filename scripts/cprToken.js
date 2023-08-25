import { statusIconMap } from './constants.js';

class CyberpunkRedLoadoutsToken extends LoadoutsRegistry.tokenClasses.default {
    defineNewToken() {
        super.defineNewToken();  // This calls the defineToken method of LoadoutsToken
        console.log("Preparing CPR item")

        if(this.objectDocument.flags?.loadouts?.stack?.max > 1){
            this.itemTokenSettings.displayBars = game.settings.get("loadouts", "loadouts-show-stack-bar"), // Set visibility for the 'hp' bar
            this.itemTokenSettings.actorData = {
                system: {
                    derivedStats: {
                        hp: {
                            max: this.objectDocument.flags.loadouts.stack.max,
                            value: this.objectDocument.flags.loadouts.stack.members.length
                        }
                    }
                }
            }
        } else {
            if(("magazine" in this.objectDocument.system) && (this.objectDocument.system.magazine.max != 0)){
                this.itemTokenSettings.displayBars = game.settings.get("loadouts", "loadouts-cpr-show-ammo-bar"),
                this.itemTokenSettings.actorData = {
                    system: {
                        derivedStats: {
                            hp: {
                                max: this.objectDocument.system.magazine.max,
                                value: this.objectDocument.system.magazine.value
                            }
                        }
                    }
                }
            }
    
            // Set equipped state overlays where desired
            if(this.objectDocument.system.equipped){
                this.itemTokenSettings.overlayEffect = statusIconMap[this.objectDocument.system.equipped]
            };
        };
    };
};

class CyberpunkRedLoadoutsItem extends LoadoutsRegistry.itemClasses.default {
    processUpdatedItem() {
        super.processUpdatedItem();

        const loadoutsScenes = game.scenes.filter(
            scene => scene.flags.loadouts).filter(
                scene => scene.flags.loadouts.isLoadoutsScene == true);
        
        const loadoutsItemToken = undefined
        for(const loadoutsScene of loadoutsScenes){
            loadoutsItemToken = game.scenes.get(loadoutsScene.id).tokens.contents.find(token => 
                token.flags.loadouts?.stack?.members?.includes(objectDocument.id))
            if(loadoutsItemToken){
                break;
            };
        };

        if((loadoutsItemToken == null) || (loadoutsItemToken == undefined)){
            console.warn("▞▖Loadouts CPR: Loadouts item not found; cannot reflect " + objectDocument.parent.name + "'s inventory change")
            return;
        };
    
        if(objectDocument.system.magazine.max != 0){
            loadoutsItemToken.update({
                actorData: {
                    system: {
                        derivedStats: {
                            hp: {
                                value: objectDocument.system.magazine.value
                            }
                        }
                    }
                }
            });
        };
        
        // Update the linked token's overlay if the item is equipped
        console.debug("▞▖Loadouts CPR: changing equip status")
        if(objectDocument.system.equipped){
            loadoutsItemToken.update({
                overlayEffect: statusIconMap[objectDocument.system.equipped]
            });
        };
    };
};

Hooks.on('loadoutsReady', function() {
    window.LoadoutsRegistry.registerTokenClass("cyberpunk-red-core", CyberpunkRedLoadoutsToken);
    window.LoadoutsRegistry.registerItemClass("cyberpunk-red-core", CyberpunkRedLoadoutsItem);
    console.log("%c▞▖Loadouts CPR: loaded Cyberpunk Red Loadouts module", 'color:#ff4bff')
});