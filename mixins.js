import { jvmRef, jvmOnce } from "./core"

const tooltipRef = jvmRef("zcore.tooltipCallbackRef")

try {
    jvmOnce("zcore.tooltipAttached", () => {
        const itemStackMixin = new Mixin("net.minecraft.world.item.ItemStack")
        const inject = itemStackMixin.inject({
            method: "getTooltipLines",
            at: new At("TAIL"),
            locals: [new Local({ type: "Ljava/util/List;", ordinal: 0 })],
            cancellable: true,
        })

        inject.attach((itemStack, callbackInfo, tooltipList) => {
            const callback = tooltipRef.get()
            if (callback != null) callback(itemStack, tooltipList)
        })
    })
} catch (e) {
    const error = `[RegisterMixins] Error: ${JSON.stringify(e)} | ${e.stack}`
    ChatLib.chat(error)
    console.error(error)
}

export const setTooltipCallback = (callback) => { tooltipRef.set(callback) }
