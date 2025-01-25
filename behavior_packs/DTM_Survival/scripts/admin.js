import { ActionFormData, ModalFormData } from '@minecraft/server-ui';
import { world } from '@minecraft/server';
import { banPlayer, unbanPlayer } from './banScript.js'; // Adjust the path accordingly

let bannedPlayers = [];

function showAdminMenu(player) {
    const adminMenu = new ActionFormData()
        .title("§l§2Admin Menu")
        .body("Select an admin function:")
        .button("Warn Player", "textures/ui/warn_player")
        .button("Kick Player", "textures/ui/kick_player")
        .button("Freeze/Unfreeze Player", "textures/ui/freeze_player")
        .button("Ban/Unban Player", "textures/ui/ban_unban_player");

    adminMenu.show(player).then((response) => {
        if (!response.canceled) {
            switch (response.selection) {
                case 0:
                    showWarnPlayerForm(player);
                    break;
                case 1:
                    showKickPlayerForm(player);
                    break;
                case 2:
                    showFreezePlayerForm(player);
                    break;
                case 3:
                    showBanUnbanPlayerForm(player);
                    break;
            }
        }
    });
}

function showWarnPlayerForm(player) {
    const players = Array.from(world.getPlayers());
    const playerNames = players.map(p => p.name);
    const warningMessages = [
        "Please follow the rules.",
        "This is your final warning.",
        "Stop spamming the chat.",
        "Respect other players."
    ];

    const warnPlayerForm = new ModalFormData()
        .title("§l§2Warn Player")
        .dropdown("Select the player to warn:", playerNames)
        .dropdown("Select a warning message:", warningMessages);

    warnPlayerForm.show(player).then((response) => {
        if (!response.canceled) {
            const selectedPlayerName = playerNames[response.formValues[0]];
            const warningMessage = warningMessages[response.formValues[1]];
            player.runCommand(`tellraw @a {"rawtext":[{"text":"[Server] @${selectedPlayerName}, ${warningMessage}"}]}`);
        }
    });
}

function showKickPlayerForm(player) {
    const players = Array.from(world.getPlayers());
    const playerNames = players.map(p => p.name);

    const kickPlayerForm = new ModalFormData()
        .title("§l§2Kick Player")
        .dropdown("Select the player to kick:", playerNames)
        .textField("Enter the reason for kicking:", "Reason");

    kickPlayerForm.show(player).then((response) => {
        if (!response.canceled) {
            const selectedPlayerIndex = response.formValues[0];
            const kickReason = response.formValues[1];
            const selectedPlayerName = playerNames[selectedPlayerIndex];
            player.runCommandAsync(`kick "${selectedPlayerName}" ${kickReason}`).catch((error) => console.error(error));
        }
    });
}

function showBanUnbanPlayerForm(player) {
    const onlinePlayers = Array.from(world.getPlayers()).map(p => p.name);
    const bannedPlayersOptions = bannedPlayers.length > 0 ? bannedPlayers : ["No banned players"];

    const banUnbanPlayerForm = new ModalFormData()
        .title("§l§2Ban/Unban Player")
        .dropdown("Select the player to ban:", onlinePlayers.length > 0 ? onlinePlayers : ["No online players"])
        .dropdown("Select the player to unban:", bannedPlayersOptions)
        .toggle("Unban player", false);

    banUnbanPlayerForm.show(player).then((response) => {
        if (!response.canceled) {
            const selectedBanPlayerIndex = response.formValues[0];
            const selectedUnbanPlayerIndex = response.formValues[1];
            const unbanPlayerToggle = response.formValues[2];

            const playerNameToBan = onlinePlayers[selectedBanPlayerIndex];
            const playerNameToUnban = bannedPlayers[selectedUnbanPlayerIndex];

            if (unbanPlayerToggle && playerNameToUnban && playerNameToUnban !== "No banned players") {
                unbanPlayer(playerNameToUnban);
                player.runCommandAsync(`tellraw @a {"rawtext":[{"text":"[Server] ${playerNameToUnban} has been unbanned."}]}`).catch((error) => console.error(error));
                bannedPlayers = bannedPlayers.filter(name => name !== playerNameToUnban);
            } else if (playerNameToBan && playerNameToBan !== "No online players") {
                const playerToBan = Array.from(world.getPlayers()).find(p => p.name === playerNameToBan);
                if (playerToBan) {
                    banPlayer(playerToBan);
                    player.runCommandAsync(`tellraw @a {"rawtext":[{"text":"[Server] ${playerNameToBan} has been banned."}]}`).catch((error) => console.error(error));
                    if (!bannedPlayers.includes(playerNameToBan)) {
                        bannedPlayers.push(playerNameToBan);
                    }
                } else {
                    player.sendMessage(`Player ${playerNameToBan} not found.`);
                }
            }
        }
    });
}

function showFreezePlayerForm(player) {
    const players = Array.from(world.getPlayers());
    const playerNames = players.map(p => p.name);

    const freezePlayerForm = new ModalFormData()
        .title("§l§2Freeze/Unfreeze Player")
        .dropdown("Select the player to freeze/unfreeze:", playerNames)
        .toggle("Warn player instead of freezing", true)
        .toggle("Unfreeze player", false);

    freezePlayerForm.show(player).then((response) => {
        if (!response.canceled) {
            const selectedPlayerIndex = response.formValues[0];
            const warnInsteadOfFreeze = response.formValues[1];
            const unfreezePlayer = response.formValues[2];

            const selectedPlayerName = playerNames[selectedPlayerIndex];

            if (unfreezePlayer) {
                player.runCommandAsync(`effect "${selectedPlayerName}" clear`).catch((error) => console.error(error));
                player.runCommandAsync(`tellraw @a {"rawtext":[{"text":"[Server] ${selectedPlayerName} has been unfrozen."}]}`).catch((error) => console.error(error));
            } else if (warnInsteadOfFreeze) {
                player.runCommandAsync(`tellraw @a {"rawtext":[{"text":"[Server] @${selectedPlayerName}, you will be frozen if you don't stop."}]}`).catch((error) => console.error(error));
            } else {
                player.runCommandAsync(`effect "${selectedPlayerName}" slowness infinite 255 true`).catch((error) => console.error(error));
                player.runCommandAsync(`effect "${selectedPlayerName}" mining_fatigue infinite 255 true`).catch((error) => console.error(error));
                player.runCommandAsync(`tellraw @a {"rawtext":[{"text":"[Server] ${selectedPlayerName} has been frozen."}]}`).catch((error) => console.error(error));
                player.runCommandAsync(`title "${selectedPlayerName}" actionbar "You are frozen! Ask in chat to be unfrozen."`).catch((error) => console.error(error));
            }
        }
    });
}

world.afterEvents.itemUse.subscribe((event) => {
    const { source, itemStack } = event;
    if (source && itemStack.typeId === "zc:admin_tool") {
        if (source.hasTag("moderator")) {
            showAdminMenu(source);
        } else {
            source.sendMessage("You do not have permission to use this tool.");
        }
    }
});
