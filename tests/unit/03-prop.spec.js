import {
    shallowMount
} from '@vue/test-utils'
import PropTest from '@/components/03-prop/PropTest.vue'

describe('PropTest.vue', () => {
    it("没有登录时", () => {
        const wrapper = shallowMount(PropTest)

        expect(wrapper.find("span").text()).toBe("hello")
    });
    
    it("已登录", () => {
        const wrapper = shallowMount(PropTest, {
            propsData: {
                username: 'jack',
                isLogin: true,
            }
        })

        expect(wrapper.find("span").text()).toBe("jack,hello")
    })
})