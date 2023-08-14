export const statusIconMap = {
    "equipped": game.settings.get("loadouts-cpr", "loadouts-cpr-equipped-overlay"),
    "carried": game.settings.get("loadouts-cpr", "loadouts-cpr-carried-overlay"),
    "owned": game.settings.get("loadouts-cpr", "loadouts-cpr-owned-overlay"),
};

export const dispositionMap = {
    "poor": -1, 
    "standard": 0, 
    "excellent": 1
};
