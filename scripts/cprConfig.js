Hooks.once("loadoutsReady", function () { 
    
    game.settings.register("loadouts-cpr", "loadouts-cpr-show-ammo-bar", {
        name: "Show Ammo Bar",
        hint: "For items with magazines, use the token's health bar to track ammo count",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });

    game.settings.register("loadouts-cpr", "loadouts-cpr-show-stack-bar", {
        name: "Show Stacking Bar",
        hint: "For items in stacks, use the token's health bar to track stack size",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
    
    game.settings.register("loadouts-cpr", "loadouts-cpr-equipped-overlay", {
        name: "Equipped Item Overlay",
        hint: "Set a custom overlay for Equipped inventory items",
        scope: "world",
        config: true,
        default: "modules/loadouts/artwork/overlays/equipped-overlay.webp",
        type: String
    });

    game.settings.register("loadouts-cpr", "loadouts-cpr-carried-overlay", {
        name: "Carried Item Overlay",
        hint: "Set a custom overlay for Carried inventory items",
        scope: "world",
        config: true,
        default: "",
        type: String
    });

    game.settings.register("loadouts-cpr", "loadouts-cpr-owned-overlay", {
        name: "Owned Item Overlay",
        hint: "Set a custom overlay for Owned inventory items",
        scope: "world",
        config: true,
        default: "",
        type: String
    });
    
});
