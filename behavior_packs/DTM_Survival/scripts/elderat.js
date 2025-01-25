import { ActionFormData, ModalFormData } from '@minecraft/server-ui';
import { world } from '@minecraft/server';

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

function showCombinedUI(player, locations) {
    const combinedUI = new ActionFormData()
        .title("§l§2Manage Locations")
        .body("Submit A New Location:")
        .button("Submit a New Location", "textures/ui/editIcon") 
        .button("Delete Marked Place", "textures/ui/trash") 
        .button("Search Location", "textures/ui/magnifyingGlass")
        .button("Clear Coordinates Message", "textures/ui/trash"); // Add Clear Coordinates Message button
    
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
                clearCoordinatesMessage(player); // Clear coordinates message when Clear Coordinates Message button is clicked
            } else {
                const selectedLocation = locations[response.selection - 4]; 
                const { x, y, z } = selectedLocation.position;
                const name = selectedLocation.name;
                updateCoordinatesScoreboard(player, x, y, z, name);
            }
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
            const name = selectedLocation.name;
            updateCoordinatesScoreboard(player, x, y, z, name);
        }
    });
}

function updateCoordinatesScoreboard(player, x, y, z, name) {
    player.runCommand(`scoreboard players set @s x ${Math.floor(x)}`);
    player.runCommand(`scoreboard players set @s y ${Math.floor(y)}`);
    player.runCommand(`scoreboard players set @s z ${Math.floor(z)}`);
}

function clearCoordinatesMessage(player) {
    player.runCommand(`scoreboard players reset @s x`);
    player.runCommand(`scoreboard players reset @s y`);
    player.runCommand(`scoreboard players reset @s z`);
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
        }
    });
}

world.afterEvents.itemUse.subscribe((event) => {
    const { source, itemStack } = event;
    if (itemStack.typeId === "zc:location_diary") {
        const locations = loadPlayerLocations(source); 
        showCombinedUI(source, locations); 
    }
});