import { ModalFormData } from '@minecraft/server-ui';
import { world } from '@minecraft/server';

function showRulesForm(player) {
    const rules = [
        "To remove this nag screen everytime you spawn you must accept the following rules:",
        "1. No griefing.",
        "2. No spamming.",
        "3. Be respectful to other players.",
        "4. No cheating or exploiting bugs."
    ].join("\n");

    const rulesForm = new ModalFormData()
        .title("§l§2Server Rules")
        .textField(rules, "Please read and accept the rules")
        .toggle("Accept the rules", false);

    rulesForm.show(player).then((response) => {
        console.log(`Form response: ${JSON.stringify(response)}`);
        if (response.formValues) {
            console.log(`Form values: ${JSON.stringify(response.formValues)}`);
        }
        if (response.formValues && response.formValues.length > 1 && response.formValues[1]) { // Accept toggle
            player.addTag("acceptedRules");
            console.log(`Player ${player.name} has accepted the rules and the tag has been added.`);
            player.runCommand(`tellraw @a {"rawtext":[{"text":"[Server] ${player.name} has accepted the rules."}]}`);
        } else { // Decline or window closed
            console.log(`Player ${player.name} did not accept the rules or closed the window.`);
            player.runCommand(`tellraw @s {"rawtext":[{"text":"[Server] You must accept the rules to play on this server. You will continue to see this message until you accept the rules."}]}`);
            showRulesForm(player); // Show the form again
        }
    }).catch((error) => {
        console.error("Error showing form:", error);
        player.runCommand(`tellraw @s {"rawtext":[{"text":"[Server] You must accept the rules to play on this server. You will continue to see this message until you accept the rules."}]}`);
        showRulesForm(player); // Show the form again
    });
}

world.afterEvents.playerSpawn.subscribe((event) => {
    const player = event.player;
    if (player) {
        console.log(`Player spawned: ${player.name}`);
        if (player.hasTag("acceptedRules")) {
            console.log(`Player ${player.name} has already accepted the rules.`);
        } else {
            console.log(`Player ${player.name} has not accepted the rules. Showing rules form.`);
            showRulesForm(player);
        }
    } else {
        console.log("Player object is undefined. Event data:", event);
    }
});