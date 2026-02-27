const ForgeVersion1 = GetJavaClass("net.minecraftforge.common.ForgeVersion")
const FabricLoader1 = Java.type("net.fabricmc.loader.api.FabricLoader")

export const versionToInt = (version) => {
    const [major, minor, patch] = version.split(".").map(Number)
    return Number(
        `${major}${String(minor).padStart(2, "0")}${String(patch).padStart(2, "0")}`
    )
}

let _gameVersion
if (Object.keys(ForgeVersion1).length > 0) {
    _gameVersion = ForgeVersion1.mcVersion
} else {
    _gameVersion = FabricLoader1.getInstance()
        .getModContainer("minecraft")
        .orElseThrow()
        .getMetadata()
        .getVersion()
        .getFriendlyString()
}
export const gameVersionString = _gameVersion
export const gameVersion = versionToInt(_gameVersion)
export const isLegacy = gameVersion < 12100
