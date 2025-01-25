import { world } from '@minecraft/server';

// In-memory storage for banned players
let bannedPlayers = [];

// Function to load banned players (mock function, replace with actual persistence logic if needed)
function loadBannedPlayers() {
    return bannedPlayers;
}

// Function to save banned players (mock function, replace with actual persistence logic if needed)
function saveBannedPlayers(players) {
    bannedPlayers = players;
}

// Function to ban a player
export function banPlayer(player) {
    const bannedPlayers = loadBannedPlayers();
    if (!bannedPlayers.includes(player.name)) {
        bannedPlayers.push(player.name);
        saveBannedPlayers(bannedPlayers);
        player.addTag("PermaBanned");
        player.sendMessage("You have been permanently banned from this server.");
        player.runCommandAsync(`kick "${player.name}" "Banned players are not allowed to join."`).catch((error) => console.error(error));
    }
}

// Function to unban a player
export function unbanPlayer(playerName) {
    let bannedPlayers = loadBannedPlayers();
    bannedPlayers = bannedPlayers.filter(name => name !== playerName);
    saveBannedPlayers(bannedPlayers);
}

// Function to check for banned players on spawn and kick them if needed
function checkBannedPlayers(event) {
    const player = event.player;
    if (player) {
        const bannedPlayers = loadBannedPlayers();
        if (bannedPlayers.includes(player.name)) {
            player.sendMessage("You are banned from this server.");
            player.runCommandAsync(`kick "${player.name}" "Banned players are not allowed to join."`).catch((error) => console.error(error));
        }
    } else {
        console.log("Player object is undefined. Event data:", event);
    }
}

// Add event listener for player spawn
world.afterEvents.playerSpawn.subscribe((event) => {
    checkBannedPlayers(event);
});
