# update_sidebar.mcfunction
# Update actionbar with coordinates
titleraw @a[scores={x=..-0}] actionbar {"rawtext":[{"text":"§aWaypoint:     §r\n"},{"score":{"name":"*","objective":"x"}},{"text":", "},{"score":{"name":"*","objective":"y"}},{"text":", "},{"score":{"name":"*","objective":"z"}}]}
titleraw @a[scores={x=0}] actionbar {"rawtext":[{"text":"§aWaypoint:     §r\n"},{"score":{"name":"*","objective":"x"}},{"text":", "},{"score":{"name":"*","objective":"y"}},{"text":", "},{"score":{"name":"*","objective":"z"}}]}
titleraw @a[scores={x=0..}] actionbar {"rawtext":[{"text":"§aWaypoint:     §r\n"},{"score":{"name":"*","objective":"x"}},{"text":", "},{"score":{"name":"*","objective":"y"}},{"text":", "},{"score":{"name":"*","objective":"z"}}]}
