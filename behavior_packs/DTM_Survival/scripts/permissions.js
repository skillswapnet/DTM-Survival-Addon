import { world } from '@minecraft/server';

// In-memory storage for player permissions
let playerPermissions = {};

// Load player permissions (mock function, replace with actual persistence logic if needed)
function loadPlayerPermissions() {
    return playerPermissions;
}

// Save player permissions (mock function, replace with actual persistence logic if needed)
function savePlayerPermissions(permissions) {
    playerPermissions = permissions;
}

// Assign permission to a player
export function assignPermission(playerName, permission) {
    const permissions = loadPlayerPermissions();
    if (!permissions[playerName]) {
        permissions[playerName] = [];
    }
    if (!permissions[playerName].includes(permission)) {
        permissions[playerName].push(permission);
        savePlayerPermissions(permissions);
    }
}

// Remove permission from a player
export function removePermission(playerName, permission) {
    const permissions = loadPlayerPermissions();
    if (permissions[playerName]) {
        permissions[playerName] = permissions[playerName].filter(perm => perm !== permission);
        if (permissions[playerName].length === 0) {
            delete permissions[playerName];
        }
        savePlayerPermissions(permissions);
    }
}

// Check if a player has a specific permission
export function hasPermission(playerName, permission) {
    const permissions = loadPlayerPermissions();
    return permissions[playerName] && permissions[playerName].includes(permission);
}

// Enable flight for players with the "Can fly" permission
export function enableFlightForPlayer(player) {
    if (hasPermission(player.name, "Can fly")) {
        player.runCommandAsync(`ability ${player.name} mayfly true`).catch((error) => console.error(error));
    } else {
        player.runCommandAsync(`ability ${player.name} mayfly false`).catch((error) => console.error(error));
    }
}

// Add event listener for player spawn to enable flight if they have the permission
world.afterEvents.playerSpawn.subscribe((event) => {
    const player = event.player;
    if (player) {
        enableFlightForPlayer(player);
    }
});
