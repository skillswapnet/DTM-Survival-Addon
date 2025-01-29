// originalScript.js
import { world, system } from '@minecraft/server';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';
import { showCannedMessagesUI } from './cannedMessages'; // Import the function

let currentPlayer = null;
let currentLocationName = '';
let currentX = 0;
let currentY = 0;
let currentZ = 0;

function loadPlayerLocations(player) {
    const savedLocations = player.getDynamicProperty('savedLocations');
    if (savedLocations) {
        return JSON.parse(savedLocations);
    }
    return [];
}

function savePlayerLocations(player, locations) {
    player.setDynamicProperty('savedLocations', JSON.stringify(locations));
}

function showInitialUI(player) {
    const initialUI = new ActionFormData()
        .title("§l§2Main Menu")
        .body("Choose an option:")
        .button("Canned Messages", "textures/ui/feedback")  // Placeholder texture for canned messages
        .button("Locations", "textures/ui/map");

    initialUI.show(player).then((response) => {
        if (!response.canceled) {
            if (response.selection === 0) {
                showCannedMessagesUI(player, showInitialUI); // Pass showInitialUI as a parameter
            } else if (response.selection === 1) {
                const locations = loadPlayerLocations(player);
                showCombinedUI(player, locations);
            }
        }
    });
}

function showCombinedUI(player, locations) {
    const combinedUI = new ActionFormData()
        .title("§l§2Manage Locations")
        .body("Submit A New Location:")
        .button("Submit a New Location", "textures/ui/editIcon")
        .button("Delete Marked Place", "textures/ui/trash")
        .button("Search Location", "textures/ui/magnifyingGlass")
        .button("Clear Coordinates Message", "textures/ui/trash");

    locations.forEach(location => {
        combinedUI.button(`§l§5${location.name}`, "textures/ui/mashup_world");
    });

    combinedUI.show(player).then((response) => {
        if (!response.canceled) {
            if (response.selection === 0) {
                showAddLocationForm(player, locations);
            } else if (response.selection === 1) {
                showDeleteLocationForm(player, locations);
            } else if (response.selection === 2) {
                showSearchLocationForm(player, locations);
            } else if (response.selection === 3) {
                clearCoordinatesMessage(player);
            } else {
                const selectedLocation = locations[response.selection - 4];
                const { x, y, z } = selectedLocation.position;
                displaySelectedLocation(player, selectedLocation);
            }
        } else {
            showInitialUI(player); // Return to the initial screen if the close button is clicked
        }
    });
}

function showSearchLocationForm(player, locations) {
    const searchForm = new ModalFormData()
        .title("§l§3Search Location")
        .textField("Enter the name of the location to search for:", "Type here...");

    searchForm.show(player).then((response) => {
        if (!response.canceled) {
            const searchQuery = response.formValues[0].trim().toLowerCase();
            const filteredLocations = locations.filter(location => location.name.toLowerCase().includes(searchQuery));
            if (filteredLocations.length > 0) {
                showFilteredLocationsUI(player, filteredLocations);
            } else {
                player.sendMessage("§cNo locations found matching the search query.");
                showCombinedUI(player, locations);
            }
        }
    });
}

function showFilteredLocationsUI(player, filteredLocations) {
    const filteredUI = new ActionFormData()
        .title("§l§2Search Results");
    filteredLocations.forEach(location => {
        filteredUI.button(`§l§5${location.name}`, "textures/ui/mashup_world");
    });

    filteredUI.show(player).then((response) => {
        if (!response.canceled) {
            const selectedLocation = filteredLocations[response.selection];
            const { x, y, z } = selectedLocation.position;
            displaySelectedLocation(player, selectedLocation);
        }
    });
}

function displaySelectedLocation(player, selectedLocation) {
    const { name, position: { x, y, z } } = selectedLocation;

    console.log(`Selected Location: ${name}, Coordinates: x=${x}, y=${y}, z=${z}`);

    try {
        player.runCommand(`scoreboard objectives add x dummy`);
        player.runCommand(`scoreboard objectives add y dummy`);
        player.runCommand(`scoreboard objectives add z dummy`);
    } catch (error) {
        console.error("Error creating scoreboards:", error);
    }

    try {
        player.runCommand(`scoreboard players set @s x ${Math.floor(x)}`);
        player.runCommand(`scoreboard players set @s y ${Math.floor(y)}`);
        player.runCommand(`scoreboard players set @s z ${Math.floor(z)}`);
    } catch (error) {
        console.error("Error setting scoreboard values:", error);
    }

    currentPlayer = player;
    currentLocationName = name;
    currentX = x;
    currentY = y;
    currentZ = z;

    system.run(updateActionbar);
}

function updateActionbar() {
    if (!currentPlayer || !currentPlayer.isValid()) {
        console.log("No valid player, stopping updateActionbar");
        return;
    }
    try {
        currentPlayer.runCommand(`titleraw @s[scores={x=..-0}] actionbar {"rawtext":[{"text":" §a${currentLocationName}\n"},{"text":" §f(${Math.floor(currentX)}, ${Math.floor(currentY)}, ${Math.floor(currentZ)})"}]}`);
        currentPlayer.runCommand(`titleraw @s[scores={x=0}] actionbar {"rawtext":[{"text":" §a${currentLocationName}\n"},{"text":" §f(${Math.floor(currentX)}, ${Math.floor(currentY)}, ${Math.floor(currentZ)})"}]}`);
        currentPlayer.runCommand(`titleraw @s[scores={x=0..}] actionbar {"rawtext":[{"text":" §a${currentLocationName}\n"},{"text":" §f(${Math.floor(currentX)}, ${Math.floor(currentY)}, ${Math.floor(currentZ)})"}]}`);
    } catch (error) {
        console.error("Error updating actionbar:", error);
    }

    system.run(updateActionbar);
}

function clearCoordinatesMessage(player) {
    try {
        player.runCommand(`scoreboard players reset @s x`);
        player.runCommand(`scoreboard players reset @s y`);
        player.runCommand(`scoreboard players reset @s z`);
        if (currentPlayer === player) {
            currentPlayer = null;
            console.log("Coordinates message cleared and update stopped.");
        }
    } catch (error) {

        console.error("Error clearing coordinates message:", error);
    }
}

function showAddLocationForm(player, locations) {
    const addLocationForm = new ModalFormData()
        .title("§l§2Add New Location")
        .dropdown("Choose a location type:", [
            "Home", 
            "Spawn", 
            "Secret Base", 
            "Village", 
            "Boss", 
            "Dungeon", 
            "Industrial Area", 
            "Shop", 
            "Nether Portal", 
            "End Portal", 
            "Strong Hold", 
            "Forest", 
            "Other"
        ], 0)
        .textField("Enter a name for your location:", "Type here...");

    addLocationForm.show(player).then((response) => {
        if (!response.canceled) {
            const locationType = response.formValues[0];
            let customName = response.formValues[1].trim();
            const locationName = customName.length > 0 ? customName : "No Name";
            const playerPosition = player.location;
            const dimensionId = player.dimension.id;

            locations.push({ name: locationName, type: locationType, position: playerPosition, dimension: dimensionId });
            savePlayerLocations(player, locations);
            showCombinedUI(player, locations);
        }
    });
}

function showDeleteLocationForm(player, locations) {
    const deleteForm = new ModalFormData()
        .title("§l§4Delete Marked Place")
        .dropdown("Select a location to delete:", locations.map(loc => loc.name), 0);

    deleteForm.show(player).then((response) => {
        if (!response.canceled) {
            const selectedIndex = response.formValues[0];
            locations.splice(selectedIndex, 1);
            savePlayerLocations(player, locations);
            showCombinedUI(player, locations);
        } else {
            showInitialUI(player); // Return to the initial screen if the close button is clicked
        }
    });
}

world.afterEvents.itemUse.subscribe((event) => {
    const { source, itemStack } = event;
    if (itemStack.typeId === "dtm:survival") {
        showInitialUI(source);
    }
});
