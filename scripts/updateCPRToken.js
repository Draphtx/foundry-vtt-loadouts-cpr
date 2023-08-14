// UPDATE ITEM HOOK
//// Updates item tokens' 'health' bar when a weapon magazine changes states
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
    statusIconMap = {
        "equipped": "modules/loadouts/artwork/icons/status-equipped.webp",
        "carried": "",
        "owned": ""
    }
    console.debug("▞▖Loadouts CPR: changing equip status")
    if(itemDocument.system.equipped){
        loadoutsItemToken.update({
            overlayEffect: statusIconMap[itemDocument.system.equipped]
        })
    }

    Hooks.off("updateItem");
    return;
}
