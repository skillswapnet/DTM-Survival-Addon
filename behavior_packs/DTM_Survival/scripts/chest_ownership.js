import { world } from '@minecraft/server';

// Function to check if a message contains an error
function isErrorMessage(message) {
    return message.toLowerCase().includes("error");
}

// Function to log error messages to the console
function logErrorMessage(playerName, message) {
    console.log(`Error message from ${playerName}: ${message}`);
}

// Subscribe to the player message event
world.events.beforeChat.subscribe(event => {
    const player = event.sender;
    const message = event.message;

    if (isErrorMessage(message)) {
        logErrorMessage(player.nameTag, message);
    }
});
