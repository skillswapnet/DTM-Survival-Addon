// cannedMessages.js
import { ActionFormData } from '@minecraft/server-ui';

export function showCannedMessagesUI(player, showInitialUI) {
    const cannedMessagesUI = new ActionFormData()
        .title("§l§2Canned Messages")
        .body("Choose a message to send:")
        .button("Help!", "textures/ui/feedback")
        .button("Follow Me", "textures/ui/direction")
        .button("Need Backup", "textures/ui/strength")
        .button("Look Here", "textures/ui/eye")
        .button("All Clear", "textures/ui/check")
        .button("Food", "textures/ui/food") // Adjust the texture if necessary
        .button("Back", "textures/ui/back");

    cannedMessagesUI.show(player).then((response) => {
        if (!response.canceled) {
            if (response.selection === 6) { // "Back" button index
                showInitialUI(player); // Return to the initial screen if Back button is clicked
            } else {
                const message = getMessage(response.selection, player);
                if (message) {
                    player.runCommand(`tellraw @a {"rawtext":[{"text":"${message}"}]}`);
                }
            }
        } else {
            showInitialUI(player); // Return to the initial screen if the window is closed
        }
    });
}

function getMessage(selection, player) {
    const playerName = player.name;
    const { x, y, z } = player.location;

    switch (selection) {
        case 0:
            return `§c[HELP!] ${playerName} at (${Math.floor(x)}, ${Math.floor(y)}, ${Math.floor(z)}) needs assistance!`;
        case 1:
            return `§a[Follow Me] ${playerName} requests you to follow them.`;
        case 2:
            return `§e[Need Backup] ${playerName} at (${Math.floor(x)}, ${Math.floor(y)}, ${Math.floor(z)}) needs backup!`;
        case 3:
            return `§b[Look Here] ${playerName} wants you to look at their location.`;
        case 4:
            return `§2[All Clear] ${playerName} announces that everything is clear.`;
        case 5:
            return `§6[Food] ${playerName} is hungry and needs food!`;
        default:
            return null;
    }
}
