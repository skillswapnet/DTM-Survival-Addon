import { world } from '@minecraft/server';

function logAvailableAfterEvents() {
    console.log('Logging available events and properties from world.afterEvents...');
    for (const property in world.afterEvents) {
        if (world.afterEvents.hasOwnProperty(property)) {
            console.log(`${property} is available.`);
        }
    }
}

logAvailableAfterEvents();
