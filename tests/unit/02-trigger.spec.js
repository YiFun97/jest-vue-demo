import { shallowMount } from "@vue/test-utils"
import FormSubmit from "@/components/02-trigger/FormSubmit.vue"

describe("Form", () => {
  it("reveals a notification when submitted", async () => {
    const wrapper = shallowMount(FormSubmit)

    wrapper.find("[data-username]").setValue("jack")
    wrapper.find("form").trigger("submit.prevent")
    await wrapper.vm.$nextTick()

    expect(wrapper.find(".message").text())
      .toBe("jack submitted")
  })
})