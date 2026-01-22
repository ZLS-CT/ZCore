import * as ZRenderLib from "../ZRenderLib/index"

export const GetJavaClass = (className) => {
    return Java.type(className)
}

const FileInputStream1 = GetJavaClass("java.io.FileInputStream")
const Files1 = GetJavaClass("java.nio.file.Files")
const File1 = GetJavaClass("java.io.File")
const FileOutputStream1 = GetJavaClass("java.io.FileOutputStream")
const Paths1 = GetJavaClass("java.nio.file.Paths")

export const versionToInt = (version) => {
    const [major, minor, patch] = version.split(".").map(Number)
    return Number(
        `${major}${String(minor).padStart(2, "0")}${String(patch).padStart(2, "0")}`
    )
}

const mc = Client.getMinecraft()
const ForgeVersion = GetJavaClass("net.minecraftforge.common.ForgeVersion")
let _gameVersion = Client.getVersion()
if (Object.keys(ForgeVersion).length > 0) {
    _gameVersion = ForgeVersion.mcVersion
}
export const gameVersionString = _gameVersion
export const gameVersion = versionToInt(_gameVersion)
export const isLegacy = gameVersion < 12100

export const modulesFolder = (isLegacy) ? Config.modulesFolder : ChatTriggers.MODULES_FOLDER

let Loader1 = null
let DataComponentTypes1 = null
if (isLegacy) {
    Loader1 = GetJavaClass("net.minecraftforge.fml.common.Loader")
} else {
    Loader1 = GetJavaClass("net.fabricmc.loader.api.FabricLoader")
    DataComponentTypes1 = GetJavaClass("net.minecraft.component.DataComponentTypes")
}

function rejectJavaObjects(key, value) {
    if (value && typeof value == "object" && value.getClass != undefined) {
        return "§c§lJAVA_ERROR§r"
    }
    return value
}
export const safeStringify = (obj) => {
    try {
        return JSON.stringify(obj, rejectJavaObjects)
    } catch(e) {
        return "error"
    }
}

export const PrettyNumber = (number, floor = false, decimalPlaces = 0) => {
    if (floor) {
        return PrettyNumber(Math.floor(number), decimalPlaces)
    }

    const roundedNumber = Number(number).toFixed(decimalPlaces)

    let parts = roundedNumber.split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return parts.length > 1 ? parts.join(".") : parts[0]
}

const dividerColorList = ["&c", "&6", "&e", "&a", "&b", "&a", "&e", "&6", "&c"]
let localDivider = ""
export const GetDivider = (width = -1) => {
    if (localDivider != "") return localDivider
    const chatWidth = (width == -1) ? ChatLib.getChatWidth() : width

    const spaceWidth = ZRenderLib.getStringWidth(" ")
    const totalSpaces = Math.floor(chatWidth / spaceWidth)

    const spacesPerSegment = Math.floor(totalSpaces / dividerColorList.length)
    const extraSpaces = totalSpaces % dividerColorList.length

    let divider = ""
    for (let i = 0; i < dividerColorList.length; i++) {
        let segment = dividerColorList[i] + "&m"
        let spaces = spacesPerSegment
        if (i < extraSpaces) {
            spaces++
        }

        for (let j = 0; j < spaces; j++) {
            segment += " "
        }
        divider += segment
    }

    let randomChars = ""
    for (let i = 0; i < 5; i++) {
        randomChars += "§" + String.fromCharCode(Math.floor(Math.random() * 62) + 48)
    }
    divider += randomChars
    return divider
}

export const _ChatDebug = (prefix, ...strings) => ChatLib.chat(prefix + strings.join(" | "))
export const ChatLog = (...strings) => _ChatDebug("&6[&aLOG&6] &r", ...strings)
export const ChatDebug = (...strings) => {
    _ChatDebug("&6[&cDEBUG&6] &r", ...strings)
    console.log(strings.join(" | "))
}
export const ChatMessage = (...strings) => ChatLib.chat(strings.join(" | "))
export const JSONLog = (...strings) => {
    let finalStrings = []
    strings.forEach((str) => {
        finalStrings.push(safeStringify(str))
    })
    ChatLib.chat(finalStrings.join(" | "))
}
export const fixElementaText = (str="") => str.replace("&", "§")

export const GetMapItemFromIndex = (map, index) => { return map.get(Array.from(map.keys())[index]) }

export const romanToDecimal = (s) => {
    s = s.toUpperCase()
    value = 0
    for (let i = 0; i < s.length; i += 1) {
        romanValues[s[i]] < romanValues[s[i + 1]] ? value -= romanValues[s[i]] : value += romanValues[s[i]]
    }
    return value
}
export const decimalToRoman = (num) => {
    let result = ""
    Object.entries(romanValues).forEach(([letter, n]) => {
        result += letter.repeat(Math.floor(num / n))
        num %= n
    })
    return result
}

export const base64Decode = (str, loop = 1) => {
    for (let i = 0; i < loop; i++) {
        str = new java.lang.String(java.util.Base64.getDecoder().decode(str)).toString()
    }
    return str
}
export const base64Encode = (str) => {
    return java.util.Base64.getEncoder().encodeToString(new java.lang.String(str).getBytes())
}

export const ReturnZeroIfNaN = (oldNumber) => {
    return (isNaN(oldNumber)) ? 0 : oldNumber
}

// Month Day Hour:Minute PM/AM
export const DateFormat = (date) => {
    const isPM = date.getHours() >= 12

    let hours = date.getHours() % 12
    hours = hours == 0 ? 12 : hours

    let monthIndex = date.getMonth()
    let day = date.getDate()
    let year = date.getFullYear()
    let minutes = date.getMinutes().toString().padStart(2, "0")

    return `${shortMonths[monthIndex]}. ${day}, ${year}, ${hours}:${minutes} ${isPM  ? "PM" : "AM"}`
}

export const getOpenedInventory = () => {
    if (isLegacy) {
        return Player.getPlayer()?.field_71070_bA?.func_85151_d/*getLowerChestInventory*/() || null
    }
    return Player.getContainer() || null
}
export const getOpenedInventoryName = () => {
    if (isLegacy) {
        return Player.getPlayer()?.field_71070_bA?.func_85151_d/*getLowerChestInventory*/()?.func_70005_c_/*getName*/() || null
    }
    return mc.currentScreen?.title?.getString() || null
}
export const getItemStackInSlot = (slot, inventory = null) => {
    if (inventory == null) {
        inventory = getOpenedInventory()
    }
    if (isLegacy) {
        return inventory?.func_70301_a/*getStackInSlot*/(slot) || null
    }
    return inventory?.getStackInSlot(slot)?.mcValue || null
}

export const isNullOrUndefined = (item) => {
    return (item == undefined || item == null)
}

export const TimeStringToSeconds = (timeString) => {
    let min = 0
    let sec = 0

    if (timeString.includes("Minutes")) {
        return parseFloat(timeString.split(" Minutes")[0].trim()) * 60
    } else {
        if (timeString.includes("m")) {
            min = parseInt(timeString.split("m")[0])
            if (timeString.includes("s")) {
                sec = parseInt(timeString.split(" ")[1].split("s")[0])
            }
        }
        else {
            sec = parseInt(timeString.split("s")[0])
        }
    }
    return (min * 60) + sec
}

export const UncompactNumber = (abbrNumber) => {
    const abbrev = abbrNumber.slice(-1)
    const numberStr = abbrNumber.slice(0, -1)

    let multiplier = 1
    switch (abbrev) {
        case "k":
            multiplier = 1000
            break
        case "m":
            multiplier = 1000000
            break
        case "b":
            multiplier = 1000000000
            break
        case "t":
            multiplier = 1000000000000
            break
    }
    return (multiplier == 1) ? parseFloat(abbrNumber) : parseFloat(numberStr) * multiplier
}

const SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"]
export const CompactNumber = (number) => {
    const tier = Math.log10(Math.abs(number)) / 3 | 0

    if (tier == 0) return number

    const suffix = SI_SYMBOL[tier]
    const scale = Math.pow(10, tier * 3)

    let scaled = number / scale
    let i = 2
    let scaledF = scaled.toFixed(i)
    let lengthF = scaledF.length
    while (scaledF.substring(lengthF, lengthF - 1) == "0") {
        i--
        scaledF = scaled.toFixed(i)
        lengthF = scaledF.length
        if (i == 0) break
    }
    return scaled.toFixed(i) + suffix
}

// xh xm xs
// export const secondsToTimeString = (seconds) => {
//     let min = Math.floor(seconds/60)
//     let hour = Math.floor(min/60)
//     if (hour > 0) return `${hour}h ${min - (hour * 60)}m ${seconds - ((min - (hour * 60)) * 60)}s`
//     return `${min}m ${seconds - (min * 60)}s`
// }
export const secondsToTimeString = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    let timeString = ""

    if (hours > 0) timeString += `${hours}h `

    if (minutes > 0 || hours > 0) timeString += `${minutes}m `

    if (remainingSeconds > 0) timeString += `${remainingSeconds}s`
    return timeString
}

export const repeat = (func, times) => {
    func()
    times && --times && repeat(func, times)
}

export const returnCenteredTextSpaces = (text) => {
    const textWidth = ZRenderLib.getStringWidth(ChatLib.addColor(text))
    const chatWidth = ChatLib.getChatWidth()

    if (textWidth >= chatWidth) {
        return text
    }

    const spaceWidth = (chatWidth - textWidth) / 2
    const spaceBuilder = new Array(parseInt((spaceWidth / ZRenderLib.getStringWidth(" ")).toFixed(0) + 1)).join(" ")
    return spaceBuilder
}

export const TitleCase = (newMessage) => {
    let finalMessage = ""
    newMessage.split(" ").forEach((part) => {
        finalMessage = finalMessage + part.toLowerCase().split("")[0].toUpperCase() + part.substring(1) + " "
    })
    finalMessage = finalMessage.substring(0, finalMessage.length - 1)

    if (finalMessage != null) {
        return finalMessage
    }
    return newMessage
}

export const rarityToColor = (rarity) => {
    switch (rarity) {
        case "COMMON":
            return "&f"
        case "UNCOMMON":
            return "&a"
        case "RARE":
            return "&9"
        case "EPIC":
            return "&5"
        case "LEGENDARY":
            return "&6"
        case "MYTHIC":
            return "&d"
        case "DIVINE":
            return "&b"
        case "SPECIAL":
            return "&c"
        case "VERY SPECIAL":
            return "&c"
    }
    return "&f"
}

export const isOnSkyblock = () => {
    const scoreBoard = ChatLib.removeFormatting(Scoreboard.getTitle())
    return Server.getIP().includes("hypixel") && (scoreBoard.includes("SKIBLOCK") || scoreBoard.includes("SKYBLOCK"))
}

const romanValues = {
    "I": 1,
    "V": 5,
    "X": 10,
    "L": 50,
    "C": 100,
    "D": 500,
    "M": 1000
}
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]
const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
]

export const colorArray = [
    {"ColorName": "red", "ColorList": [255, 0, 0], "ColorCode": "§c", "RenderColor": ZRenderLib.RED},
    {"ColorName": "green", "ColorList": [0, 255, 0], "ColorCode": "§a", "RenderColor": ZRenderLib.GREEN},
    {"ColorName": "blue", "ColorList": [0, 0, 255], "ColorCode": "§9", "RenderColor": ZRenderLib.BLUE},
    {"ColorName": "yellow", "ColorList": [255, 255, 0], "ColorCode": "§e", "RenderColor": ZRenderLib.YELLOW},
    {"ColorName": "orange", "ColorList": [255, 170, 0], "ColorCode": "§6", "RenderColor": ZRenderLib.GOLD},
    {"ColorName": "aqua", "ColorList": [0, 255, 255], "ColorCode": "§b", "RenderColor": ZRenderLib.AQUA},
    {"ColorName": "cyan", "ColorList": [0, 170, 170], "ColorCode": "§3", "RenderColor": ZRenderLib.DARK_AQUA},
    {"ColorName": "pink", "ColorList": [255, 0, 255], "ColorCode": "§d", "RenderColor": ZRenderLib.LIGHT_PURPLE},
    {"ColorName": "purple", "ColorList": [118, 0, 188], "ColorCode": "§5", "RenderColor": ZRenderLib.DARK_PURPLE},
    {"ColorName": "black", "ColorList": [0, 0, 0], "ColorCode": "§8", "RenderColor": ZRenderLib.BLACK},
    {"ColorName": "gray", "ColorList": [85, 85, 85], "ColorCode": "§7", "RenderColor": ZRenderLib.GRAY},
    {"ColorName": "white", "ColorList": [255, 255, 255], "ColorCode": "§f", "RenderColor": ZRenderLib.WHITE}
]
export const colorStringArray = [
    "§cRed",
    "§aGreen",
    "§9Blue",
    "§eYellow",
    "§bAqua",
    "§dPink",
    "§3Cyan",
    "§5Purple",
    "§8Black",
    "§7Gray",
    "§fWhite"
]

export const GetColorIndexFromName = (colorName) => {
    return colorArray.findIndex(color => color.ColorName == colorName)
}

export const GetColorDataFromIndex = (colorIndex) => {
    return colorArray[colorIndex]
}

export const CapitalizeFirstLetter = (text) => {
    return text.toLowerCase().split("")[0].toUpperCase() + text.substring(1)
}

export const RGBAToLong = (r, g, b, a) => {
    return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF) | ((a & 0xFF) << 24)
}
export const ColorToInt = (r, g, b) => {
    return r * 65536 + g * 256 + b
}

// export const IsStringOrTextComponentEmpty = (value) => {
//     if (typeof value == "string") {
//         return value.trim() == ""
//     } else if (value instanceof TextComponent) {
//         return value.unformattedText.toString().trim() == ""
//     } else if (value instanceof ZTextComponent) {
//         return value.isEmpty()
//     }
//     return false
// }

export const GetUnformattedStringOrTextComponent = (value) => {
    if (typeof value == "string") {
        return ChatLib.removeFormatting(value)
    } else if (value instanceof TextComponent) {
        throw new Error("TextComponent is not supported")
        // return value.unformattedText
    } else if (value instanceof ZTextComponent) {
        return value.getUnformattedText()
    }
    return null
}
export const GetFormattedStringOrTextComponent = (value) => {
    if (typeof value == "string") {
        return value
    } else if (value instanceof TextComponent) {
        throw new Error("TextComponent is not supported")
        // return value.formattedText
    } else if (value instanceof ZTextComponent) {
        return value.getFormattedText()
    }
    return value
}

export const GetUnformattedScoreboardLines = () => {
    let lines = []
    if (isLegacy) {
        Scoreboard.getLines(false).map(line => line?.getName()?.removeFormatting()?.replace(/(?!✌)[^\u0000-\u007F]/g, ""))?.forEach(line => {
            line = ChatLib.removeFormatting(line).trim()
            lines.push(line)
        })
    } else {
        Scoreboard.getLines(false).map(line => line?.getName()?.unformattedText?.replace(/(?!✌)[^\u0000-\u007F]/g, ""))?.forEach(line => {
            line = ChatLib.removeFormatting(line).trim()
            lines.push(line)
        })
    }

    return lines
}

export const CheckIfOnIslandFromScoreboardLines = (scoreboardLines, islandName) => {
    if (isNullOrUndefined(scoreboardLines)) return false

    for (let i = 0; i < scoreboardLines.length; i++) {
        if (scoreboardLines[i].includes(islandName)) return true
    }
    return false
}

export const CheckIfOnIsland = (islandName) => {
    const scoreboardLines = GetUnformattedScoreboardLines()
    return CheckIfOnIslandFromScoreboardLines(scoreboardLines, islandName)
}

export const GetServerPlayerList = () => {
    const playerList = []

    const NetHandlerPlayClient = Client.getConnection()
    if (isLegacy) {
        const scoreboard = Scoreboard.getScoreboard()
        const teams = scoreboard?.func_96525_g/*getTeams*/()
        if (isNullOrUndefined(teams)) return []

        teams.forEach(team => {
            let players = team.func_96670_d/*getMembershipCollection*/()
            players.forEach(player => {
                let networkPlayerInfo = NetHandlerPlayClient.func_175104_a/*getPlayerInfo*/(player)
                if (networkPlayerInfo != null) {
                    let playerMP = new PlayerMP(new net.minecraft.client.entity.EntityOtherPlayerMP(World.getWorld(), networkPlayerInfo.func_178845_a/*getGameProfile*/()))
                    let formattedName = playerMP.getDisplayName().getText().trim()
                    let playerUUID = NormalizePlayerUUID(playerMP.getUUID().toString())

                    // !! test this
                    playerList.push({
                        playerObject: playerMP,
                        uuid: playerUUID,
                        usernameAndRank: formattedName,
                    })
                }
            })
        })
    } else {
        let scoreboard = Scoreboard.getScoreboard()
        let teams = scoreboard?.getTeams()
        if (isNullOrUndefined(teams)) return []

        teams.forEach(team => {
            let players = team.getPlayerList()
            players.forEach(player => {
                let networkPlayerInfo = NetHandlerPlayClient.getPlayerListEntry(player)
                if (networkPlayerInfo != null) {
                    let teamPrefix = new TextComponent(team.getPrefix() || "")
                    let teamSuffix = new TextComponent(team.getSuffix() || "")
                    let playerName = networkPlayerInfo.profile.getName()
                    let displayName = null
                    let teamColor = team.getColor()
                    if (teamColor != null) {
                        displayName = new TextComponent({
                            text: playerName,
                            color: teamColor,
                        })
                    } else {
                        displayName = new TextComponent(playerName)
                    }

                    let playerMP = new PlayerMP(new net.minecraft.client.network.OtherClientPlayerEntity(World.toMC(), networkPlayerInfo.profile))
                    let formattedName = teamPrefix.withText(displayName).withText(teamSuffix)
                    let playerUUID = NormalizePlayerUUID(networkPlayerInfo.profile.getId().toString())

                    playerList.push({
                        playerObject: playerMP,
                        uuid: playerUUID,
                        usernameAndRank: formattedName.formattedText,
                    })
                }
            })
        })
    }
    return playerList
}

export const NormalizePlayerUUID = (playerUUID) => {
    return playerUUID.toString().replaceAll("-", "").toLowerCase()
}

export const TryReplace = (original, textToReplace, newText, exactOnly = false) => {
    if (exactOnly) return original == textToReplace ? newText : original
    if (original.includes(textToReplace)) {
        original = original.replace(textToReplace, newText)
    }
    return original
}

export const CopyLockedFile = (sourcePathString, destinationPathString) => {
    const sourcePath = Paths1.get(sourcePathString).normalize()
    const destinationPath = Paths1.get(destinationPathString).normalize()

    const sourceFile = new File1(sourcePath.toString())
    const destFile = new File1(destinationPath.toString())

    try {
        const fis = new FileInputStream1(sourceFile)
        const sourceChannel = fis.getChannel()
        const fos = new FileOutputStream1(destFile)
        const destChannel = fos.getChannel()
        let  count = 0
        let size = sourceChannel.size()

        while (count < size) {
            count += destChannel.transferFrom(
                sourceChannel,
                count,
                size - count
            )
        }
    }
    catch (e) { }
}

export const DeleteLockedFile = (filePathString) => {
    const filePath = Paths1.get(filePathString).normalize()
    const file = new File1(filePath.toString())

    if (file.exists()) {
        file.setWritable(true, false)
        if (file.delete()) return true

        try {
            const fos = new FileOutputStream1(file, true)
            fos.close()
        }
        catch (e) { }

        try {
            Files1.delete(filePath)
            return true
        }
        catch (e) { file.deleteOnExit() }
    } else {
        return true
    }
    return false
}

export const CopyFolderRecursive = (source, destination, exclusions = []) => {
    const sourcePath = Paths1.get(source).normalize()
    const destinationPath = Paths1.get(destination).normalize()

    if (!Files1.exists(sourcePath)) return

    Files1.walk(sourcePath).forEach((file) => {
        if (exclusions.some((exclusion) => file.startsWith(exclusion))) return

        const relativePath = sourcePath.relativize(file)
        const destFile = destinationPath.resolve(relativePath)

        if (Files1.isDirectory(file)) {
            Files1.createDirectories(destFile)
        } else {
            Files1.copy(file, destFile)
        }
    })
}

export const DeleteFolderRecursive = (folderPathString) => {
    const folderPath = Paths1.get(folderPathString).normalize()
    const folder = new File1(folderPath.toString())

    if (folder.exists()) {
        folder.listFiles().forEach((file) => {
            if (file.isDirectory()) {
                DeleteFolderRecursive(file.getPath())
            }
            file.delete()
        })
        folder.delete()
    }
}

export const SplitStringOrTextComponentByNewline = (text) => {
    let lineU = GetUnformattedStringOrTextComponent(text).trim()
    if (lineU == "") {
        return [new ZTextComponent()]
    }

    if (typeof text == "string") {
        return text.split("\n")
    } else if (text instanceof TextComponent) {
        throw new Error("TextComponent is not supported")
        // const list = []
        // ZRenderLib.splitText(text, 512).lines.forEach((line) => {
        //     list.push(new ZTextComponent().withText(line))
        // })
        // return list
    } else if (text instanceof ZTextComponent) {
        const list = []
        ZRenderLib.splitText(text.build(true), 512).lines.forEach((line) => {
            list.push(new ZTextComponent().withTextComponent(new TextComponent(line)))
        })
        return list
    }
    return null
}

export const GetTextWithBackgroundData = (textArray, colorList) => {
    if (isNullOrUndefined(colorList)) {
        colorList = [30, 30, 30, 155]
    }

    let longestLength = 0
    let lineList = []
    textArray.forEach((line) => {
        let lineU = GetUnformattedStringOrTextComponent(line).trim()
        if (lineU == "") {
            lineList.push(line)
            return
        }

        lineList.push(...SplitStringOrTextComponentByNewline(line))
    })

    lineList.forEach((line) => {
        let width = ZRenderLib.getStringWidth(GetUnformattedStringOrTextComponent(line).trim())
        longestLength = Math.max(longestLength, width)
    })
    longestLength += 6.5

    let divider = GetDivider(longestLength - ZRenderLib.getStringWidth("  "))
    let finalTextComponent = new ZTextComponent()
    lineList.forEach((line) => {
        let lineU = GetUnformattedStringOrTextComponent(line).trim()
        if (lineU == "_-_divider") {
            finalTextComponent.withText("\n" + divider)
            return
        }

        if (!finalTextComponent.isEmpty()) {
            finalTextComponent.withText("\n")
        }

        finalTextComponent.withText(line)
    })

    return {
        textComponent: finalTextComponent,
        backgroundColorList: colorList,
        width: longestLength,
        height: (lineList.length * 9) + (2.5 * 2),
    }
}

export const DrawTextWithBackground = (drawContext, text, startX, startY, backgroundColorList, scale, backgroundWidth, backgroundHeight) => {
    ZRenderLib.drawRectRGBA(drawContext, startX, startY, backgroundWidth * scale, backgroundHeight * scale, ...backgroundColorList)
    if (isLegacy) {
        ZRenderLib.drawGUIString(drawContext, text, startX + 3.5, startY + 3.5, ZRenderLib.WHITE, scale, false, true, 512)
    } else {
        ZRenderLib.drawGUIText(drawContext, text, startX + 3.5, startY + 3.5, ZRenderLib.WHITE, scale, false, true, 512)
    }
}

export const GetPlayerLevelColor = (playerLevel) => {
    let levelColor = "&7"
    if (playerLevel >= 40) levelColor = "&f"
    if (playerLevel >= 80) levelColor = "&e"
    if (playerLevel >= 120) levelColor = "&a"
    if (playerLevel >= 160) levelColor = "&2"
    if (playerLevel >= 200) levelColor = "&b"
    if (playerLevel >= 240) levelColor = "&3"
    if (playerLevel >= 280) levelColor = "&9"
    if (playerLevel >= 320) levelColor = "&d"
    if (playerLevel >= 360) levelColor = "&5"
    if (playerLevel >= 400) levelColor = "&6"
    if (playerLevel >= 440) levelColor = "&c"
    if (playerLevel >= 480) levelColor = "&4"

    return `${levelColor}${playerLevel}`
}

export const GetClassName = (classObject) => {
    return classObject?.getClass()?.getName() || "ERROR"
}

export const tryGetTagKey = (nbtCompound, type, key) => {
    if (tagContainsKey(nbtCompound, key)) {
        return getTagKey(nbtCompound, type, key)
    }
    return null
}
export const getTagKey = (nbtCompound, type, key) => {
    if (type == "string") {
        return getStringTag(nbtCompound, key)
    } else if (type == "int") {
        return getIntTag(nbtCompound, key)
    } else if (type == "long") {
        return getLongTag(nbtCompound, key)
    } else if (type == "boolean") {
        return getBooleanTag(nbtCompound, key)
    } else if (type == "byteArray") {
        return getByteArrayTag(nbtCompound, key)
    } else if (type == "short") {
        return getShortTag(nbtCompound, key)
    } else if (type == "compoundTag") {
        return getCompoundTagTag(nbtCompound, key)
    }
    return null
}
export const tagContainsKey = (nbtCompound, key, type = null) => {
    if (isLegacy) {
        if (type != null) {
            return nbtCompound.func_150297_b/*hasKey*/(key, type)
        }
        return nbtCompound.func_74764_b/*hasKey*/(key)
    }
    return nbtCompound.contains(key)
}
export const getTagList = (nbtCompound, key, type) => {
    if (isLegacy) {
        return nbtCompound.func_150295_c/*getTagList*/(key, type)
    }
    return nbtCompound.getList(key).orElse(null)
}
export const getTagListCount = (nbtCompound) => {
    if (isLegacy) {
        return nbtCompound.func_74745_c/*tagCount*/()
    }
    return nbtCompound.size()
}
export const getTagListKeys = (nbtCompound) => {
    if (isLegacy) {
        return nbtCompound.func_150296_c/*getKeySet*/()
    }
    return nbtCompound.getKeys()
}
export const getStringTagAt = (nbtCompound, index) => {
    if (isLegacy) {
        return nbtCompound.func_150307_f/*getStringTagAt*/(index)
    }
    return nbtCompound.getCompound(index).orElse(null)
}
export const getCompoundTagAt = (nbtCompound, index) => {
    if (isLegacy) {
        return nbtCompound.func_150305_b/*getCompoundTagAt*/(index)
    }
    return nbtCompound.getCompound(index).orElse(null)
}
export const getStringTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74779_i/*getString*/(key)
    }
    return nbtCompound.getString(key).orElse(null)
}
export const getIntTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74762_e/*getInt*/(key)
    }
    return nbtCompound.getInt(key).orElse(null)
}
export const getLongTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74763_f/*getLong*/(key)
    }
    return nbtCompound.getLong(key).orElse(null)
}
export const getBooleanTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74767_n/*getBoolean*/(key)
    }
    return nbtCompound.getBoolean(key).orElse(null)
}
export const getByteArrayTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74770_j/*getByteArray*/(key)
    }
    return nbtCompound.getByteArray(key).orElse(null)
}
export const getShortTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74765_d/*getShort*/(key)
    }
    return nbtCompound.getShort(key).orElse(null)
}
export const getCompoundTagTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74775_l/*getCompoundTag*/(key)
    }
    return nbtCompound.get(key)
}

export const getItemStackName = (itemStack, formatted = true) => {
    if (isLegacy) {
        let name = itemStack.func_82833_r/*getDisplayName*/()
        return (formatted) ? name : ChatLib.removeFormatting(name).toLowerCase()
    }
    let name = new TextComponent(itemStack.getName())
    return (formatted) ? name.formattedText : name.unformattedText.toLowerCase()
}
export const setItemStackName = (itemStack, name) => {
    if (isLegacy) {
        itemStack.func_151001_c/*setStackDisplayName*/(name)
        return
    }
    itemStack.set(DataComponentTypes1.CUSTOM_NAME, new TextComponent(name))
}
export const getItemStackLore = (itemStack, formatted = true) => {
    if (isLegacy) {
        const loreLines = []
        const itemLore = getCustomDataNBT(itemStack).func_74775_l("display").func_150295_c("Lore", 8)
        const loreCount = getTagListCount(itemLore)
        for (let i = 0; i < loreCount; i++) {
            let loreLine = getStringTagAt(itemLore, i)
            if (!formatted) {
                loreLine = ChatLib.removeFormatting(loreLine).toLowerCase()
            }
            loreLines.push(loreLine)
        }
        return loreLines
    }
    const loreComponent = itemStack.get(DataComponentTypes1.LORE)
    return new ArrayList(loreComponent?.lines() || []).map(line => {
        if (formatted) {
            return new TextComponent(line).formattedText
        }
        return new TextComponent(line).unformattedText.toLowerCase()
    })
}
export const getCustomDataNBT = (item) => {
    if (isLegacy) {
        const itemStack = getItemStack(item)
        return legacyGetOrCreateCustomNBT(itemStack)
    }
    const customDataComponent = item.get(DataComponentTypes1.CUSTOM_DATA)
    return customDataComponent ? customDataComponent.nbt : NBTComponent.DEFAULT.nbt.copy()
}

export const legacyGetOrCreateCustomNBT = (itemStack) => {
    let nbt = itemStack.func_77978_p()
    if (nbt == null) {
        nbt = new net.minecraft.nbt.NBTTagCompound()
        itemStack.func_77982_d(nbt)
    }
    return nbt
}

export const isDyeableLeatherArmor = (item) => {
    if (isLegacy) {
        const itemStack = getItemStack(item)
        const registryName = itemStack.func_77973_b().registryName
        return (
            registryName == "minecraft:leather_helmet" ||
            registryName == "minecraft:leather_chestplate" ||
            registryName == "minecraft:leather_leggings" ||
            registryName == "minecraft:leather_boots"
        )
    }
    return (
        item.isOf(net.minecraft.item.Items.LEATHER_HELMET) ||
        item.isOf(net.minecraft.item.Items.LEATHER_CHESTPLATE) ||
        item.isOf(net.minecraft.item.Items.LEATHER_LEGGINGS) ||
        item.isOf(net.minecraft.item.Items.LEATHER_BOOTS)
    )
}
export const getItemStackNBTObject = (itemStack) => {
    if (itemStack == null) return null
    if (!isLegacy && itemStack.isEmpty()) return null
    let finalObject = {}
    let itemID = null
    let customNBT = null
    let loreLines = []
    let itemName = null
    let dyedColorInt = null

    if (isLegacy) {
        return convertNBTToNBTObject(getCustomDataNBT(itemStack))
    }
    itemID = getItemStackRegistryName(itemStack)

    customNBT = itemStack.get(DataComponentTypes1.CUSTOM_DATA)?.nbt || null

    const loreComponent = itemStack.get(DataComponentTypes1.LORE)
    loreLines = new ArrayList(loreComponent?.lines() || []).map(line => {
        return new TextComponent(line).formattedText
    })

    const customNameComponent = itemStack.get(DataComponentTypes1.CUSTOM_NAME)
    if (customNameComponent == null) {
        itemName = new TextComponent(itemStack.get(DataComponentTypes1.ITEM_NAME)).formattedText
    } else {
        itemName = new TextComponent(customNameComponent).formattedText
    }

    if (isDyeableLeatherArmor(itemStack)) {
        dyedColorInt = itemStack.get(DataComponentTypes1.DYED_COLOR)?.rgb()
        if (isNullOrUndefined(dyedColorInt)) dyedColorInt = null
    }

    if (itemID != null) finalObject["id"] = itemID
    if (customNBT != null) finalObject["ExtraAttributes"] = customNBT
    if ((loreLines.length > 0 || dyedColorInt != null || itemName) && !finalObject.hasOwnProperty("display")) finalObject["display"] = {}
    if (loreLines.length > 0) finalObject["display"]["Lore"] = loreLines
    if (itemName) finalObject["display"]["Name"] = itemName
    if (dyedColorInt != null) finalObject["display"]["color"] = dyedColorInt

    return finalObject
}
export const convertNBTToNBTObject = (itemNBT) => {
    if (itemNBT == null) return null
    let finalObject = {}
    let itemID = null
    let customNBT = null
    let loreLines = []
    let itemName = null
    let dyedColorInt = null

    itemID = GetModernitemIDRegistryName(getShortTag(itemNBT, "id"))

    if (tagContainsKey(itemNBT, "tag")) {
        itemNBT = getCompoundTagTag(itemNBT, "tag")
    }

    customNBT = null
    if (tagContainsKey(itemNBT, "ExtraAttributes")) {
        customNBT = getCompoundTagTag(itemNBT, "ExtraAttributes")
    }

    if (tagContainsKey(itemNBT, "display")) {
        const displayTag = getCompoundTagTag(itemNBT, "display")

        if (tagContainsKey(displayTag, "Lore", 9)) {
            const itemLore = getTagList(displayTag, "Lore", 8)
            const loreCount = getTagListCount(itemLore)
            for (let i = 0; i < loreCount; i++) {
                // !! changed from "" to At in legacy
                const loreLine = getStringTagAt(itemLore, i)
                loreLines.push(loreLine)
            }
        }

        if (tagContainsKey(displayTag, "Name")) {
            itemName = getStringTag(displayTag, "Name")
        }

        if (tagContainsKey(displayTag, "color")) {
            dyedColorInt = getIntTag(displayTag, "color")
        }
    }

    if (itemID != null) finalObject["id"] = itemID
    if (customNBT != null) finalObject["ExtraAttributes"] = customNBT
    if ((loreLines.length > 0 || dyedColorInt != null || itemName) && !finalObject.hasOwnProperty("display")) finalObject["display"] = {}
    if (loreLines.length > 0) finalObject["display"]["Lore"] = loreLines
    if (itemName) finalObject["display"]["Name"] = itemName
    if (dyedColorInt != null) finalObject["display"]["color"] = dyedColorInt

    return finalObject
}

export const getItemStack = (item) => {
    if (isLegacy) {
        if (item instanceof com.chattriggers.ctjs.minecraft.wrappers.inventory.Item) {
            return item.itemStack
        }
        return item
    }
    if (item instanceof com.chattriggers.ctjs.api.inventory.Item) {
        return item.mcValue
    }
    return item
}

export const getItemStackRegistryName = (itemStack) => {
    if (isLegacy) {
        return getItemStack(itemStack).func_77973_b().registryName
    }
    return itemStack.getItem().toString() || "minecraft:air"
}

export const getCustomNBTKeyFromNBTObject = (itemNBTObject, type, key) => {
    if (!itemNBTObject) return null

    if (!itemNBTObject.hasOwnProperty("ExtraAttributes")) return null
    const extraTag = itemNBTObject["ExtraAttributes"]
    if (isNullOrUndefined(extraTag)) return null

    return getTagKey(extraTag, type, key)
}
export const getCustomNBTKey = (itemStack, type, key) => {
    const itemNBTObject = getItemStackNBTObject(itemStack)
    return getCustomNBTKeyFromNBTObject(itemNBTObject, type, key)
}

export const LegacyGetItemStackFromHoverEvent = (event) => {
    let item = null
    if (mc.currentScreen != null && mc.currentScreen instanceof GuiContainer) {
        const slot = (mc.currentScreen).getSlotUnderMouse()
        if (slot != null) {
            item = slot.getStack()
        }
    }

    if (item == null) {
        item = event.itemStack
    }
    return item
}

export const GetNormalizedNewLines = (baseText) => {
    if (isNullOrUndefined(baseText)) return ""
    const compareText = GetUnformattedStringOrTextComponent(baseText)
    if (compareText == "") return ""
    if (compareText.endsWith("\n\n")) {
        return ""
    } else if (compareText.endsWith("\n")) {
        return "\n"
    }
    return "\n\n"
}

export const DrawItemOverlayRectangleRGBA = (drawContext, x, y, z, r, g, b, a) => {
    ZRenderLib.drawRectRGBA(drawContext, x, y, 16, 16, r, g, b, a, z)
}
export const DrawItemOverlayRectangleJavaColor = (drawContext, x, y, z, javaColor) => {
    DrawItemOverlayRectangleRGBA(drawContext, x, y, z, javaColor.getRed(), javaColor.getGreen(), javaColor.getBlue(), javaColor.getAlpha())
}

export const modernEntityClassNameMap = {
    "class_1295": "EntityAreaEffectCloud",
    "class_1303": "EntityExperienceOrb",
    "class_1420": "EntityBat",
    "class_1427": "EntityGolem",
    "class_1428": "EntityChicken",
    "class_1430": "EntityCow",
    "class_1431": "EntityCod",
    "class_1433": "EntityDolphin",
    "class_1438": "EntityMooshroom",
    "class_1439": "EntityIronGolem",
    "class_1440": "EntityPanda",
    "class_1451": "EntityCat",
    "class_1452": "EntityPig",
    "class_1453": "EntityParrot",
    "class_1454": "EntityPufferfish",
    "class_1456": "EntityPolarBear",
    "class_1462": "EntitySalmon",
    "class_1463": "EntityRabbit",
    "class_1472": "EntitySheep",
    "class_1473": "EntitySnowGolem",
    "class_1474": "EntityTropicalFish",
    "class_1477": "EntitySquid",
    "class_1481": "EntityTurtle",
    "class_1493": "EntityWolf",
    "class_1495": "EntityDonkey",
    "class_1498": "EntityHorse",
    "class_1500": "EntityMule",
    "class_1501": "EntityLlama",
    "class_1506": "EntitySkeletonHorse",
    "class_1507": "EntityZombieHorse",
    "class_1510": "EntityEnderDragon",
    "class_1511": "EntityEnderCrystal",
    "class_1528": "EntityWither",
    "class_1531": "EntityArmorStand",
    "class_1532": "EntityLeashKnot",
    "class_1533": "EntityItemFrame",
    "class_1534": "EntityPainting",
    "class_1536": "EntityFishingBobber",
    "class_1538": "EntityLightningBolt",
    "class_1540": "EntityFallingBlock",
    "class_1541": "EntityTNT",
    "class_1542": "EntityItem",
    "class_1545": "EntityBlaze",
    "class_1548": "EntityCreeper",
    "class_1549": "EntityCaveSpider",
    "class_1550": "EntityElderGuardian",
    "class_1551": "EntityDrowned",
    "class_1559": "EntityEndermite",
    "class_1560": "EntityEnderman",
    "class_1564": "EntityEvoker",
    "class_1570": "EntityGiant",
    "class_1571": "EntityGhast",
    "class_1576": "EntityHusk",
    "class_1577": "EntityGuardian",
    "class_1581": "EntityIllusioner",
    "class_1584": "EntityRavager",
    "class_1589": "EntityMagmaCube",
    "class_1590": "EntityZombifiedPiglin",
    "class_1593": "EntityPhantom",
    "class_1604": "EntityPillager",
    "class_1606": "EntityShulker",
    "class_1613": "EntitySkeleton",
    "class_1614": "EntitySilverfish",
    "class_1617": "EntitySpellcastingIllager",
    "class_1621": "EntitySlime",
    "class_1627": "EntityStray",
    "class_1628": "EntitySpider",
    "class_1632": "EntityVindicator",
    "class_1634": "EntityVex",
    "class_1639": "EntityWitherSkeleton",
    "class_1640": "EntityWitch",
    "class_1641": "EntityZombieVillager",
    "class_1642": "EntityZombie",
    "class_1646": "EntityVillager",
    "class_1657": "EntityPlayer",
    "class_1667": "EntityArrow",
    "class_1669": "EntityEvokerFangs",
    "class_1670": "EntityDragonFireball",
    "class_1671": "EntityFireworkRocket",
    "class_1672": "EntityEyeOfEnder",
    "class_1673": "EntityLlamaSpit",
    "class_1674": "EntityFireball",
    "class_1677": "EntitySmallFireball",
    "class_1678": "EntityShulkerBullet",
    "class_1679": "EntitySpectralArrow",
    "class_1680": "EntitySnowball",
    "class_1681": "EntityEgg",
    "class_1683": "EntityExperienceBottle",
    "class_1684": "EntityEnderPearl",
    "class_1685": "EntityTrident",
    "class_1686": "EntityPotion",
    "class_1687": "EntityWitherSkull",
    "class_1690": "EntityBoat",
    "class_1694": "EntityChestMinecart",
    "class_1695": "EntityMinecart",
    "class_1696": "EntityFurnaceMinecart",
    "class_1697": "EntityCommandBlockMinecart",
    "class_1699": "EntitySpawnerMinecart",
    "class_1700": "EntityHopperMinecart",
    "class_1701": "EntityTNTMinecart",
    "class_3222": "EntityServerPlayer",
    "class_3701": "EntityOcelot",
    "class_3732": "EntityPatroller",
    "class_3986": "EntityTraderLlama",
    "class_3989": "EntityWanderingTrader",
    "class_4019": "EntityFox",
    "class_4466": "EntityBee",
    "class_4760": "EntityHoglin",
    "class_4836": "EntityPiglin",
    "class_4985": "EntityStrider",
    "class_5136": "EntityZoglin",
    "class_5419": "EntityPiglinBrute",
    "class_745": "EntityOtherPlayerMP",
    "class_746": "EntityPlayerMP",
}

export const GetModernEntityClassName = (entity) => {
    const className = entity.getClassName()
    if (!isLegacy) return modernEntityClassNameMap[className] || className
    return className
}

export const modernitemIDToRegistryNameMap = {
    1: "minecraft:stone",
    2: "minecraft:grass",
    3: "minecraft:dirt",
    4: "minecraft:cobblestone",
    5: "minecraft:planks",
    6: "minecraft:sapling",
    7: "minecraft:bedrock",
    8: "minecraft:flowing_water",
    9: "minecraft:water",
    10: "minecraft:flowing_lava",
    11: "minecraft:lava",
    12: "minecraft:sand",
    13: "minecraft:gravel",
    14: "minecraft:gold_ore",
    15: "minecraft:iron_ore",
    16: "minecraft:coal_ore",
    17: "minecraft:log",
    18: "minecraft:leaves",
    19: "minecraft:sponge",
    20: "minecraft:glass",
    21: "minecraft:lapis_ore",
    22: "minecraft:lapis_block",
    23: "minecraft:dispenser",
    24: "minecraft:sandstone",
    25: "minecraft:noteblock",
    27: "minecraft:golden_rail",
    28: "minecraft:detector_rail",
    29: "minecraft:sticky_piston",
    30: "minecraft:web",
    31: "minecraft:tallgrass",
    32: "minecraft:deadbush",
    33: "minecraft:piston",
    35: "minecraft:wool",
    37: "minecraft:yellow_flower",
    38: "minecraft:red_flower",
    39: "minecraft:brown_mushroom",
    40: "minecraft:red_mushroom",
    41: "minecraft:gold_block",
    42: "minecraft:iron_block",
    43: "minecraft:double_stone_slab",
    44: "minecraft:stone_slab",
    45: "minecraft:brick_block",
    46: "minecraft:tnt",
    47: "minecraft:bookshelf",
    48: "minecraft:mossy_cobblestone",
    49: "minecraft:obsidian",
    50: "minecraft:torch",
    51: "minecraft:fire",
    52: "minecraft:mob_spawner",
    53: "minecraft:oak_stairs",
    54: "minecraft:chest",
    56: "minecraft:diamond_ore",
    57: "minecraft:diamond_block",
    58: "minecraft:crafting_table",
    60: "minecraft:farmland",
    61: "minecraft:furnace",
    62: "minecraft:lit_furnace",
    65: "minecraft:ladder",
    66: "minecraft:rail",
    67: "minecraft:stone_stairs",
    69: "minecraft:lever",
    70: "minecraft:stone_pressure_plate",
    72: "minecraft:wooden_pressure_plate",
    73: "minecraft:redstone_ore",
    76: "minecraft:redstone_torch",
    77: "minecraft:stone_button",
    78: "minecraft:snow_layer",
    79: "minecraft:ice",
    80: "minecraft:snow",
    81: "minecraft:cactus",
    82: "minecraft:clay",
    84: "minecraft:jukebox",
    85: "minecraft:fence",
    86: "minecraft:pumpkin",
    87: "minecraft:netherrack",
    88: "minecraft:soul_sand",
    89: "minecraft:glowstone",
    90: "minecraft:portal",
    91: "minecraft:lit_pumpkin",
    95: "minecraft:stained_glass",
    96: "minecraft:trapdoor",
    97: "minecraft:monster_egg",
    98: "minecraft:stonebrick",
    99: "minecraft:brown_mushroom_block",
    100: "minecraft:red_mushroom_block",
    101: "minecraft:iron_bars",
    102: "minecraft:glass_pane",
    103: "minecraft:melon_block",
    106: "minecraft:vine",
    107: "minecraft:fence_gate",
    108: "minecraft:brick_stairs",
    109: "minecraft:stone_brick_stairs",
    110: "minecraft:mycelium",
    111: "minecraft:waterlily",
    112: "minecraft:nether_brick",
    113: "minecraft:nether_brick_fence",
    114: "minecraft:nether_brick_stairs",
    116: "minecraft:enchanting_table",
    119: "minecraft:end_portal",
    120: "minecraft:end_portal_frame",
    121: "minecraft:end_stone",
    122: "minecraft:dragon_egg",
    123: "minecraft:redstone_lamp",
    125: "minecraft:double_wooden_slab",
    126: "minecraft:wooden_slab",
    127: "minecraft:cocoa",
    128: "minecraft:sandstone_stairs",
    129: "minecraft:emerald_ore",
    130: "minecraft:ender_chest",
    131: "minecraft:tripwire_hook",
    133: "minecraft:emerald_block",
    134: "minecraft:spruce_stairs",
    135: "minecraft:birch_stairs",
    136: "minecraft:jungle_stairs",
    137: "minecraft:command_block",
    138: "minecraft:beacon",
    139: "minecraft:cobblestone_wall",
    141: "minecraft:carrots",
    142: "minecraft:potatoes",
    143: "minecraft:wooden_button",
    145: "minecraft:anvil",
    146: "minecraft:trapped_chest",
    147: "minecraft:light_weighted_pressure_plate",
    148: "minecraft:heavy_weighted_pressure_plate",
    151: "minecraft:daylight_detector",
    152: "minecraft:redstone_block",
    153: "minecraft:quartz_ore",
    154: "minecraft:hopper",
    155: "minecraft:quartz_block",
    156: "minecraft:quartz_stairs",
    157: "minecraft:activator_rail",
    158: "minecraft:dropper",
    159: "minecraft:stained_hardened_clay",
    160: "minecraft:stained_glass_pane",
    161: "minecraft:leaves2",
    162: "minecraft:log2",
    163: "minecraft:acacia_stairs",
    164: "minecraft:dark_oak_stairs",
    165: "minecraft:slime",
    166: "minecraft:barrier",
    167: "minecraft:iron_trapdoor",
    168: "minecraft:prismarine",
    169: "minecraft:sea_lantern",
    170: "minecraft:hay_block",
    171: "minecraft:carpet",
    172: "minecraft:hardened_clay",
    173: "minecraft:coal_block",
    174: "minecraft:packed_ice",
    175: "minecraft:double_plant",
    179: "minecraft:red_sandstone",
    180: "minecraft:red_sandstone_stairs",
    181: "minecraft:double_stone_slab2",
    182: "minecraft:stone_slab2",
    183: "minecraft:spruce_fence_gate",
    184: "minecraft:birch_fence_gate",
    185: "minecraft:jungle_fence_gate",
    186: "minecraft:dark_oak_fence_gate",
    187: "minecraft:acacia_fence_gate",
    188: "minecraft:spruce_fence",
    189: "minecraft:birch_fence",
    190: "minecraft:jungle_fence",
    191: "minecraft:dark_oak_fence",
    192: "minecraft:acacia_fence",
    256: "minecraft:iron_shovel",
    257: "minecraft:iron_pickaxe",
    258: "minecraft:iron_axe",
    259: "minecraft:flint_and_steel",
    260: "minecraft:apple",
    261: "minecraft:bow",
    262: "minecraft:arrow",
    263: "minecraft:coal",
    264: "minecraft:diamond",
    265: "minecraft:iron_ingot",
    266: "minecraft:gold_ingot",
    267: "minecraft:iron_sword",
    268: "minecraft:wooden_sword",
    269: "minecraft:wooden_shovel",
    270: "minecraft:wooden_pickaxe",
    271: "minecraft:wooden_axe",
    272: "minecraft:stone_sword",
    273: "minecraft:stone_shovel",
    274: "minecraft:stone_pickaxe",
    275: "minecraft:stone_axe",
    276: "minecraft:diamond_sword",
    277: "minecraft:diamond_shovel",
    278: "minecraft:diamond_pickaxe",
    279: "minecraft:diamond_axe",
    280: "minecraft:stick",
    281: "minecraft:bowl",
    282: "minecraft:mushroom_stew",
    283: "minecraft:golden_sword",
    284: "minecraft:golden_shovel",
    285: "minecraft:golden_pickaxe",
    286: "minecraft:golden_axe",
    287: "minecraft:string",
    288: "minecraft:feather",
    289: "minecraft:gunpowder",
    290: "minecraft:wooden_hoe",
    291: "minecraft:stone_hoe",
    292: "minecraft:iron_hoe",
    293: "minecraft:diamond_hoe",
    294: "minecraft:golden_hoe",
    295: "minecraft:wheat_seeds",
    296: "minecraft:wheat",
    297: "minecraft:bread",
    298: "minecraft:leather_helmet",
    299: "minecraft:leather_chestplate",
    300: "minecraft:leather_leggings",
    301: "minecraft:leather_boots",
    302: "minecraft:chainmail_helmet",
    303: "minecraft:chainmail_chestplate",
    304: "minecraft:chainmail_leggings",
    305: "minecraft:chainmail_boots",
    306: "minecraft:iron_helmet",
    307: "minecraft:iron_chestplate",
    308: "minecraft:iron_leggings",
    309: "minecraft:iron_boots",
    310: "minecraft:diamond_helmet",
    311: "minecraft:diamond_chestplate",
    312: "minecraft:diamond_leggings",
    313: "minecraft:diamond_boots",
    314: "minecraft:golden_helmet",
    315: "minecraft:golden_chestplate",
    316: "minecraft:golden_leggings",
    317: "minecraft:golden_boots",
    318: "minecraft:flint",
    319: "minecraft:porkchop",
    320: "minecraft:cooked_porkchop",
    321: "minecraft:painting",
    322: "minecraft:golden_apple",
    323: "minecraft:sign",
    324: "minecraft:wooden_door",
    325: "minecraft:bucket",
    326: "minecraft:water_bucket",
    327: "minecraft:lava_bucket",
    328: "minecraft:minecart",
    329: "minecraft:saddle",
    330: "minecraft:iron_door",
    331: "minecraft:redstone",
    332: "minecraft:snowball",
    333: "minecraft:boat",
    334: "minecraft:leather",
    335: "minecraft:milk_bucket",
    336: "minecraft:brick",
    337: "minecraft:clay_ball",
    338: "minecraft:reeds",
    339: "minecraft:paper",
    340: "minecraft:book",
    341: "minecraft:slime_ball",
    342: "minecraft:chest_minecart",
    343: "minecraft:furnace_minecart",
    344: "minecraft:egg",
    345: "minecraft:compass",
    346: "minecraft:fishing_rod",
    347: "minecraft:clock",
    348: "minecraft:glowstone_dust",
    349: "minecraft:fish",
    350: "minecraft:cooked_fish",
    351: "minecraft:dye",
    352: "minecraft:bone",
    353: "minecraft:sugar",
    354: "minecraft:cake",
    355: "minecraft:bed",
    356: "minecraft:repeater",
    357: "minecraft:cookie",
    358: "minecraft:filled_map",
    359: "minecraft:shears",
    360: "minecraft:melon",
    361: "minecraft:pumpkin_seeds",
    362: "minecraft:melon_seeds",
    363: "minecraft:beef",
    364: "minecraft:cooked_beef",
    365: "minecraft:chicken",
    366: "minecraft:cooked_chicken",
    367: "minecraft:rotten_flesh",
    368: "minecraft:ender_pearl",
    369: "minecraft:blaze_rod",
    370: "minecraft:ghast_tear",
    371: "minecraft:gold_nugget",
    372: "minecraft:nether_wart",
    373: "minecraft:potion",
    374: "minecraft:glass_bottle",
    375: "minecraft:spider_eye",
    376: "minecraft:fermented_spider_eye",
    377: "minecraft:blaze_powder",
    378: "minecraft:magma_cream",
    379: "minecraft:brewing_stand",
    380: "minecraft:cauldron",
    381: "minecraft:ender_eye",
    382: "minecraft:speckled_melon",
    383: "minecraft:spawn_egg",
    384: "minecraft:experience_bottle",
    385: "minecraft:fire_charge",
    386: "minecraft:writable_book",
    387: "minecraft:written_book",
    388: "minecraft:emerald",
    389: "minecraft:item_frame",
    390: "minecraft:flower_pot",
    391: "minecraft:carrot",
    392: "minecraft:potato",
    393: "minecraft:baked_potato",
    394: "minecraft:poisonous_potato",
    395: "minecraft:map",
    396: "minecraft:golden_carrot",
    397: "minecraft:skull",
    398: "minecraft:carrot_on_a_stick",
    399: "minecraft:nether_star",
    400: "minecraft:pumpkin_pie",
    401: "minecraft:fireworks",
    402: "minecraft:firework_charge",
    403: "minecraft:enchanted_book",
    404: "minecraft:comparator",
    405: "minecraft:netherbrick",
    406: "minecraft:quartz",
    407: "minecraft:tnt_minecart",
    408: "minecraft:hopper_minecart",
    409: "minecraft:prismarine_shard",
    410: "minecraft:prismarine_crystals",
    411: "minecraft:rabbit",
    412: "minecraft:cooked_rabbit",
    413: "minecraft:rabbit_stew",
    414: "minecraft:rabbit_foot",
    415: "minecraft:rabbit_hide",
    416: "minecraft:armor_stand",
    417: "minecraft:iron_horse_armor",
    418: "minecraft:golden_horse_armor",
    419: "minecraft:diamond_horse_armor",
    420: "minecraft:lead",
    421: "minecraft:name_tag",
    422: "minecraft:command_block_minecart",
    423: "minecraft:mutton",
    424: "minecraft:cooked_mutton",
    425: "minecraft:banner",
    427: "minecraft:spruce_door",
    428: "minecraft:birch_door",
    429: "minecraft:jungle_door",
    430: "minecraft:acacia_door",
    431: "minecraft:dark_oak_door",
    2256: "minecraft:record_13",
    2257: "minecraft:record_cat",
    2258: "minecraft:record_blocks",
    2259: "minecraft:record_chirp",
    2260: "minecraft:record_far",
    2261: "minecraft:record_mall",
    2262: "minecraft:record_mellohi",
    2263: "minecraft:record_stal",
    2264: "minecraft:record_strad",
    2265: "minecraft:record_ward",
    2266: "minecraft:record_11",
    2267: "minecraft:record_wait",
}

export const GetModernitemIDRegistryName = (itemID) => {
    return modernitemIDToRegistryNameMap[itemID] || "minecraft:air"
}

export const FixRenderItemIntoSlotRenderValues = (drawContext, originalItem, x, y, z) => {
    if (isLegacy) {
        return [
            null, // drawContext
            drawContext?.itemStack, // item
            originalItem, // x
            x, // y
            0, // z
        ]
    }
    return [
        drawContext, // drawContext
        originalItem, // item
        x, // x
        y, // y
        z, // z
    ]
}

export const moveFile = (target, destination, replace) => {
    const targetFile = new File1(target)
    const destinationFile = new File1(destination)
    destinationFile.getParentFile().mkdirs()
    return targetFile.renameTo(destinationFile)
}

export const isModLoaded = (modName) => {
    if (isLegacy) {
        return Loader1.isModLoaded(modName)
    }
    return Loader1.getInstance().isModLoaded(modName)
}
export const getInstalledModList = () => {
    if (isLegacy) {
        return Loader1.instance().getModList()
    }
    let modList = []
    Loader1.getInstance().getAllMods().forEach(mod => {
        modList.push(mod.getMetadata().getId())
    })
    return modList
}

const delayedCallbacks = Object.create(null)
register("step", () => {
    const now = Date.now()
    for (const id in delayedCallbacks) {
        let entry = delayedCallbacks[id]
        if (!entry || !entry.active) continue

        if (now - entry.start >= entry.delay) {
            entry.active = false
            try {
                entry.callback()
            } catch (e) {
                console.error(`DelayedCallback ${id} failed`, e)
            }
            delete delayedCallbacks[id]
        }
    }
}).setFps(20)

export const StartDelayedCallback = (id, delayMs, callback) => {
    const entry = delayedCallbacks[id]
    const now = Date.now()
    if (entry) {
        entry.start = now
        entry.delay = delayMs
        entry.callback = callback
        entry.active = true
        return
    }

    delayedCallbacks[id] = {
        start: now,
        delay: delayMs,
        callback,
        active: true,
    }
}
export const DelayedCallbackExists = (id) => {
    const entry = delayedCallbacks[id]
    return !!(entry && entry.active)
}
export const DeleteDelayedCallback = (id) => {
    const entry = delayedCallbacks[id]
    if (!entry) return false
    delete delayedCallbacks[id]
    return true
}

export const GetExtendedColorString = (hexCode) => {
    const hexCodeU = hexCode.replace(/^#/, "").toLowerCase().padStart(6, "0")

    let finalString = "§#"
    hexCodeU.split("").forEach((code) => {
        finalString += `§${code}`
    })

    if (finalString.length != 14) return hexCode
    return `${finalString}§/${hexCode}`
}

export class ZTextComponent {
    constructor() {
        this.textComponentList = []
    }

    getTextComponentList() {
        return this.textComponentList
    }

    withText(...args) { return this.addText(...args) }
    addText(text, color = null, clickEvent = null, hoverEvent = null) {
        if (typeof text == "string") {
            this.addTextObject({
                text: text,
                color: color,
                clickEvent: clickEvent,
                hoverEvent: hoverEvent,
            })
        } else if (text instanceof ZTextComponent) {
            this.addZTextComponent(text)
        } else {
            throw new Error(`Text must be a string | got "${typeof text}"`)
        }
        return this
    }
    withTextList(...args) { return this.addTextList(...args) }
    addTextList(textList) {
        textList.forEach(text => {
            this.addText(text)
        })
        return this
    }

    withTextObject(...args) { return this.addTextObject(...args) }
    addTextObject(textObject) {
        if (!textObject.hasOwnProperty("text")) {
            throw new Error("Text object must have a 'text' property.")
        }
        if (textObject.text == null || textObject.text == "") {
            return this
        }
        this.textComponentList.push(textObject)
        return this
    }
    withTextObjectList(...args) { return this.addTextObjectList(...args) }
    addTextObjectList(textObjectList) {
        if (!Array.isArray(textObjectList)) {
            throw new Error("Text object list must be an array | got " + typeof textObjectList)
        }
        textObjectList.forEach(textObject => {
            this.addTextObject(textObject)
        })
        return this
    }

    withZTextComponent(...args) { return this.addZTextComponent(...args) }
    addZTextComponent(zTextComponent) {
        if (!(zTextComponent instanceof ZTextComponent)) {
            throw new Error("Argument must be an instance of ZTextComponent.")
        }
        zTextComponent.getTextComponentList().forEach(component => {
            if (component instanceof TextComponent) {
                this.addTextComponent(component)
                return
            }
            this.addTextObject(component)
        })
        return this
    }

    withTextComponent(...args) { return this.addTextComponent(...args) }
    addTextComponent(textComponent) {
        if (!(textComponent instanceof TextComponent)) {
            throw new Error("Argument must be an instance of TextComponent.")
        }
        this.textComponentList.push(textComponent)
        return this
    }

    build(legacyOutputString = true) {
        try {
            if (isLegacy) {
                const textList = this.textComponentList.map(component => {
                    let text = component.color
                        ? GetExtendedColorString(component.color).replace(component.color, component.text)
                        : component.text

                    const textComponent = new TextComponent(text)
                    if (component.clickEvent) {
                        textComponent.setClick(component.clickEvent.action, component.clickEvent.value)
                    }
                    if (component.hoverEvent) {
                        textComponent.setHover(component.hoverEvent.action, component.hoverEvent.value)
                    }

                    return textComponent
                })

                const message = new Message(textList)
                if (legacyOutputString) {
                    return message.getFormattedText()
                }
                return message
            }

            let textComponent = new TextComponent("")
            this.textComponentList.forEach(component => {
                try {
                    if (component instanceof TextComponent) {
                        textComponent = textComponent.withText(component)
                        return
                    }
                    if (component.color == null && component.clickEvent == null && component.hoverEvent == null) {
                        textComponent = textComponent.withText(component.text)
                        return
                    }
                    textComponent = textComponent.withText(component)
                } catch (e) {
                    ChatDebug(`ZTextComponent add component error:`, e, e.stack, safeStringify(component), typeof component.text)
                }
            })
            return textComponent
        } catch (e) {
            ChatDebug("ZTextComponent build error:", e, e.stack)
        }
        return null
    }

    getUnformattedText() {
        const build = this.build(false)
        if (isLegacy) {
            return build.getUnformattedText()
        }
        return build.unformattedText
    }
    getFormattedText() {
        let build = this.build(false)
        if (isLegacy) {
            return build.getFormattedText()
        }
        return build.formattedText
    }
    isEmpty() {
        return this.textComponentList.length == 0
    }
    chat() {
        return this.build(false)?.chat()
    }
}

export class LRUCacheMap {
    constructor(capacity) {
        this.capacity = capacity
        this.cache = new Map()
    }
    has(key) {
        return this.cache.has(key)
    }
    get(key) {
        if (!this.cache.has(key)) return null

        const value = this.cache.get(key)
        this.cache.delete(key)
        this.cache.set(key, value)
        return value
    }
    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key)
        }
        this.cache.set(key, value)

        if (this.cache.size > this.capacity) {
            const firstKey = this.cache.keys().next().value
            this.cache.delete(firstKey)
        }
    }
    clear() {
        this.cache.clear()
    }
    size() {
        return this.cache.size
    }
}
export class LRUCacheList {
    constructor(capacity) {
        this.capacity = capacity
        this.cache = new Set()
    }
    has(key) {
        return this.cache.has(key)
    }
    getFirst() {
        return this.cache.values().next().value
    }
    get(key) {
        if (!this.cache.has(key)) return false
        this.add(key)
        return true
    }
    delete(key) {
        return this.cache.delete(key)
    }
    add(key) {
        if (this.cache.has(key)) {
            this.cache.delete(key)
        }
        this.cache.add(key)

        if (this.cache.size > this.capacity) {
            this.cache.delete(this.getFirst())
        }
    }
    clear() {
        this.cache.clear()
    }
    size() {
        return this.cache.size
    }
}

const pathSymbol = Symbol("path")
export class DataObject {
    constructor(moduleName, defaultObject = {}, filePath = ".data.json") {
        this[pathSymbol] = [moduleName, filePath]
        let data = FileLib.read(moduleName, filePath)
        try {
            data = data ? JSON.parse(data) : {}
        } catch (e) {
            console.error(e)
            console.log(`[ZCore] Reset ${moduleName} to default data.`)
            data = {}
        }
        Object.assign(this, defaultObject, data)
    }

    save() {
        FileLib.write(
            this[pathSymbol][0],
            this[pathSymbol][1],
            JSON.stringify(this, null, 4),
            true,
        )
    }

    autosave(interval = 5) {
        register("step", () => this.save()).setDelay(60 * interval)
        register("gameUnload", () => this.save())
    }
}

export const helmetNames = new Set(
    "hat",
    "helmet",
    "mask",
    "crown",
    "head",
    "heart",
    "fedora",
    "goggles",
    "cap",
    "tophat",
    "velvet_top_hat",
    "leather cap",
    "leather helmet",
    "leather_helmet",
    "minecraft:leather_helmet",
)
export const chestplateNames = new Set(
    "chest",
    "chestplate",
    "jacket",
    "tunic",
    "shirt",
    "cashmere_jacket",
    "leather tunic",
    "leather chestplate",
    "leather_chestplate",
    "minecraft:leather_chestplate",
)
export const leggingsNames = new Set(
    "leggings",
    "pants",
    "trousers",
    "legs",
    "legging",
    "leg",
    "satin_trousers",
    "leather trousers",
    "leather pants",
    "leather leggings",
    "leather_leggings",
    "minecraft:leather_leggings",
)
export const bootsNames = new Set(
    "boots",
    "shoes",
    "shoe",
    "boot",
    "oxford_shoes",
    "leather shoes",
    "leather boots",
    "leather_boots",
    "minecraft:leather_boots",
)

export const GetArmorType = (itemName) => {
    if (isNullOrUndefined(itemName)) return null
    itemName = ChatLib.removeFormatting(itemName).toLowerCase().trim()
    if (Constants.helmetNames.has(itemName)) return "helmet"
    if (Constants.chestplateNames.has(itemName)) return "chestplate"
    if (Constants.leggingsNames.has(itemName)) return "leggings"
    if (Constants.bootsNames.has(itemName)) return "boots"
    return null
}