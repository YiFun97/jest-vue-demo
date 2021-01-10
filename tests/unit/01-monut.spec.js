import { shallowMount,mount } from '@vue/test-utils'
import Child from '@/components/01-mount/Child.vue'
import Parent from '@/components/01-mount/Parent.vue'


describe('子组件的浅加载和加载', () => {
  it('子组件的浅加载和加载', () => {
    const shallowWrapper = shallowMount(Child)
    const mountWrapper = mount(Child)
    console.log('shallowWrapper', shallowWrapper.html())
    console.log('mountWrapper', mountWrapper.html())
  })
  it('父子组件浅加载和加载', () => {
    const shallowWrapper = shallowMount(Parent)
    const mountWrapper = mount(Parent)
    console.log('shallowWrapper', shallowWrapper.html())
    console.log('mountWrapper', mountWrapper.html())
    
  })
})
