
# Side Action

This resource pack sets the actionbar postion to the top
right, the sidebar to the left, and title on the bottom.

## Installing the pack:

Add the Side Action v1.2.1 Add-on to your resource packs on your world.

### How to use titleraw on the actionbar or title to display scores

This example uses the scoreboard objective `Money`. 
After creating an objective, type the following into a command 
block and set it to Repeating, Unconditional, Always Active.
Make sure to place the command block in a ticking area.

```js
titleraw @a actionbar {"rawtext":[{"text":"Money: "}, {"score":{"name":"*", "objective":"Money"}}]}
```

```js
titleraw @a title {"rawtext":[{"text":"Money: "}, {"score":{"name":"*", "objective":"Money"}}]}
```

## Author

- [@mittens4all](https://www.github.com/mittens4all)
- [Youtube](https://www.youtube.com/@mittens4all)

# Gratitudes

- [Zhea Evyline](https://discord.gg/SYstTYx5G5) \\ Bedrock Commands Community Discord
- [coddy2009](https://discord.gg/46JUdQb) \\ Bedrock Add-ons Discord

```js
       _                              _     _       _ _  
      (_)  _     _                   | |   (_)     | | | 
 ____  _ _| |_ _| |_ _____ ____   ___| |_____ _____| | | 
|    \| (_   _|_   _) ___ |  _ \ /___)_____  (____ | | | 
| | | | | | |_  | |_| ____| | | |___ |     | / ___ | | | 
|_|_|_|_|  \__)  \__)_____)_| |_(___/      |_\_____|\_)_)
                                                         
```