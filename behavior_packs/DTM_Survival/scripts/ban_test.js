import { world } from '@minecraft/server';

function logAndModifyBookInPlayerInventory(player) {
    console.log("logAndModifyBookInPlayerInventory called");

    console.log("Logging and modifying book in slot 0 of the player's inventory:");
    try {
        const inventoryComponent = player.getComponent('minecraft:inventory');
        if (inventoryComponent && inventoryComponent.container) {
            console.log(`Inventory Component Found`);

            const inventory = inventoryComponent.container;
            const itemStack = inventory.getItem(0);

            console.log(`Raw itemStack data: ${JSON.stringify(itemStack)}`);

            if (itemStack && itemStack.id) {
                console.log(`Slot 0: ${itemStack.id}, Count: ${itemStack.amount}`);
                if (itemStack.id === "minecraft:writable_book") {
                    console.log("Writable book found in player's inventory");

                    // Modify the content of the writable book
                    const newContent = [
                        "This is the first page.",
                        "This is the second page.",
                        "This is the third page."
                    ];
                    itemStack.getTag().setTag("pages", newContent.map(text => ({ text })));
                    inventory.setItem(0, itemStack);
                    console.log("Book content modified:", newContent);
                } else {
                    console.log("Item in slot 0 is not a writable book.");
                }
            } else {
                console.log(`Slot 0 is empty or item ID is undefined.`);
            }
        } else {
            console.log("No inventory container available.");
        }
    } catch (error) {
        console.log(`Error accessing inventory component for player: ${error}`);
    }
}

world.afterEvents.itemUse.subscribe((event) => {
    const { source, itemStack } = event;
    if (source && itemStack.typeId === "zc:test_ban_tool") {
        source.sendMessage("Logging and modifying book in slot 0 of player's inventory...");
        console.log("Test log tool used");
        logAndModifyBookInPlayerInventory(source);
    }
});
