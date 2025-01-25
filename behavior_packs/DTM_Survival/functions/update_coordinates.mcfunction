# update_coordinates.mcfunction
# Update actionbar with the player's current coordinates
titleraw @s actionbar {"rawtext":[{"text":"§aCoordinates: X: "},{"score":{"name":"@s","objective":"x"}},{"text":", Y: "},{"score":{"name":"@s","objective":"y"}},{"text":", Z: "},{"score":{"name":"@s","objective":"z"}}]}