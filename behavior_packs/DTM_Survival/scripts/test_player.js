import { world } from '@minecraft/server';

function logPlayerProperties(player) {
    console.log('Logging player properties and methods:');
    for (const prop in player) {
        console.log(`Property: ${prop} - Type: ${typeof player[prop]}`);
    }
}

// Subscribe to playerSpawn event to test player properties
world.afterEvents.playerSpawn.subscribe((event) => {
    console.log('playerSpawn event fired');
    const player = event.player;
    if (player) {
        logPlayerProperties(player);
    } else {
        console.error('Player is undefined in playerSpawn event');
    }
});
