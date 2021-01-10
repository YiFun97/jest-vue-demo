import Emitter from '@/components/04-emit/Emitter.vue'
import { shallowMount } from "@vue/test-utils"

describe("Emitter", () => {
  it("emit并带一个参数", () => {
    const wrapper = shallowMount(Emitter)

    wrapper.vm.emitEvent()

    console.log(wrapper.emitted())
    //{ myEvent: [ [ 'name' ] ] }
  })
  it("emits an event with two arguments", () => {
    const wrapper = shallowMount(Emitter)
  
    wrapper.vm.emitEvent()

    expect(wrapper.emitted().myEvent[0]).toEqual(["name"])
  })
})