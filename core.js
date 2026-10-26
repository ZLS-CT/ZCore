let ForgeVersion = null
try {
    ForgeVersion = Java.type("net.minecraftforge.common.ForgeVersion")
} catch (e) { }
let FabricLoader = null
try {
    FabricLoader = Java.type("net.fabricmc.loader.api.FabricLoader")
} catch (e) { }

class ExportableValue {
    constructor(initial) {
        this._value = initial;
    }

    get value() {
        return this._value;
    }

    set value(v) {
        this._value = v;
    }

    toString() {
        return String(this._value);
    }

    valueOf() {
        return this._value;
    }
}

export const versionToInt = (version) => {
    const parts = version.split(".").map(n => Number(n))
    const major = parts[0]
    const minor = parts[1] ?? 0
    const patch = parts[2] ?? 0
    return Number(`${major}${String(minor).padStart(2, "0")}${String(patch).padStart(2, "0")}`)
}

let _gameVersion
if (ForgeVersion && Object.keys(ForgeVersion).length > 0) {
    _gameVersion = ForgeVersion.mcVersion
} else if (FabricLoader) {
    _gameVersion = FabricLoader.getInstance()
        .getModContainer("minecraft")
        .orElseThrow()
        .getMetadata()
        .getVersion()
        .getFriendlyString()
}
export const gameVersionString = _gameVersion
export const gameVersion = versionToInt(_gameVersion.replace(/-.*$/, ""))
export const isLegacy = gameVersion < 12100
export let isZJS = new ExportableValue(false)
export let isFork = new ExportableValue(false)
try {
    isZJS = Object.keys(ZJS).length > 0
} catch(e) { }
try {
    isFork = Object.keys(com.chattriggers.ctjs.api.render.RenderUtils).length > 0
} catch(e) { }

const _jvmProps = java.lang.System.getProperties()
export const jvmSingleton = (key, factory) => {
    const existing = _jvmProps.get(key)
    if (existing != null) return existing
    const created = factory()
    const winner = _jvmProps.putIfAbsent(key, created)
    return winner != null ? winner : created
}

export const jvmRef = (key, initialValue = null) => {
    const existing = _jvmProps.get(key)
    if (existing != null && existing instanceof java.util.concurrent.atomic.AtomicReference) return existing
    const created = new java.util.concurrent.atomic.AtomicReference(initialValue)
    _jvmProps.put(key, created)
    return created
}

export const jvmOnce = (key, func) => {
    if (_jvmProps.get(key) != null) return false
    func()
    _jvmProps.putIfAbsent(key, "true")
    return true
}

export const jvmObject = (key, make = () => ({})) => {
    const ref = jvmRef(key)
    if (ref.get() == null) {
        ref.compareAndSet(null, make())
    }
    return ref.get()
}

export const clearObject = (obj) => Object.keys(obj).forEach(k => delete obj[k])

export const jvmReplace = (key, setup) => {
    const holder = jvmRef(key)
    const oldTeardown = holder.getAndSet(null)
    if (oldTeardown != null) {
        try { oldTeardown() } catch (e) { console.error(e) }
    }
    const teardown = setup()
    holder.set(typeof teardown == "function" ? teardown : null)
}

export const jvmCreateOrReuse = (key, create) => {
    const ref = jvmRef(key)
    try {
        const value = create()
        ref.set(value)
        return value
    } catch (e) {
        const existing = ref.get()
        if (existing == null) throw e
        return existing
    }
}

export const registerShared = (id, type, callback) => {
    const holder = jvmRef(`trigger.${id}`)
    const old = holder.getAndSet(null)
    if (old != null) {
        try {
            old.unregister()
        } catch (e) {
            console.error(e)
        }
    }
    const trigger = register(type, callback)
    holder.set(trigger)
    return trigger
}
