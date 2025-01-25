import { world } from '@minecraft/server';

console.log("Available properties and methods in 'world.afterEvents':");

if (world.afterEvents) {
    for (const property in world.afterEvents) {
        console.log(`Property: ${property} - Type: ${typeof world.afterEvents[property]}`);
    }
} else {
    console.log("No properties available in 'world.afterEvents'");
}

console.log("Available properties and methods in 'world.beforeEvents':");

if (world.beforeEvents) {
    for (const property in world.beforeEvents) {
        console.log(`Property: ${property} - Type: ${typeof world.beforeEvents[property]}`);
    }
} else {
    console.log("No properties available in 'world.beforeEvents'");
}