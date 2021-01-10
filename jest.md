Vue Test Utils 是 Vue.js 官方的单元测试实用工具库。

测试运行器 (test runner) 就是运行测试的程序。

[Jest](https://jestjs.io/docs/zh-Hans/getting-started) 是功能最全的测试运行器

环境搭建

1.使用`vue-cli`新建的项目可以直接选择`jest`作为测试框架

2.如果是已创建的`vue-cli`项目，可以使用以下命令集成`jest`

```
vue add unit-jest
```

### 配置 `Jest`

`Jest` 的配置可以在 `package.json` 里配置；也可以新建一个文件 `jest.config.js`， 放在项目根目录即可。这里我选择的是配置在 `jest.config.js` 中：

```
module.exports = {
    moduleFileExtensions: [
        'js',
        'vue'
    ],
    transform: {
        '^.+\\.vue$': '<rootDir>/node_modules/vue-jest',
        '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    snapshotSerializers: [
        'jest-serializer-vue'
    ],
    testMatch: ['**/__tests__/**/*.spec.js'],
    transformIgnorePatterns: ['<rootDir>/node_modules/']
}
```

各配置项说明：

- `moduleFileExtensions` 告诉 `Jest` 需要匹配的文件后缀
- `transform` 匹配到 `.vue` 文件的时候用 `vue-jest` 处理， 匹配到 `.js` 文件的时候用 `babel-jest` 处理
- `moduleNameMapper` 处理 `webpack` 的别名，比如：将 `@` 表示 `/src` 目录
- `snapshotSerializers` 将保存的快照测试结果进行序列化，使得其更美观
- `testMatch` 匹配哪些文件进行测试
- `transformIgnorePatterns` 不进行匹配的目录

### 两种渲染方式

`vue-test-utils` 提供了两种方式用于渲染，`mount` 和 `shallowMount`。

一个组件无论使用这两种方法的哪个都会返回一个 `wrapper`，也就是一个包含了 Vue 组件的对象。

`shallowMount` 将会创建一个包含被挂载和渲染的 `Vue` 组件的 `Wrapper`，只存根当前组件，不包含子组件

写两个组件

child.vue

```js
<template>
  <div>Child</div>
</template>

<script>
export default {
  name: "Child"
}
</script>

```

parent.vue

```js
<template>
  <div>Child</div>
</template>

<script>
export default {
  name: "Child"
}
</script>

```

```js
<template>
  <div>
    <h1>Parent text</h1>
    <Child />
  </div>
</template>

<script>
import Child from "./Child.vue"

export default {
  name: "Parent",
  components: { Child },
}
</script>

```

测试组件

```js
import { shallowMount,mount } from '@vue/test-utils'
import Child from '@/components/01-mount/Child.vue'
import Parent from '@/components/01-mount/Parent.vue'


describe('渲染方式, () => {
  it('子组件的浅加载和加载', () => {
    const shallowWrapper = shallowMount(Child)
    const mountWrapper = mount(Child)
    console.log('shallowWrapper', shallowWrapper.html())
    console.log('mountWrapper', mountWrapper.html())
    // shallowWrapper <div>Child</div>
//  mountWrapper <div>Child</div>

  })
  it('父子组件浅加载和加载', () => {
    const shallowWrapper = shallowMount(Parent)
    const mountWrapper = mount(Parent)
    console.log('shallowWrapper', shallowWrapper.html())
    console.log('mountWrapper', mountWrapper.html())
    //  shallowWrapper 
     //	<div>
     //        <h1>Parent text</h1>
       //      <child-stub></child-stub>
    //     </div>
	// mountWrapper <div>
        <h1>Parent text</h1>
        <div>Child</div>
      </div>

  })
})

```

可以看到

原本 `<Child />` 应该出现的地方被替换成了 `<child-stub />`。`shallowMount` 会渲染常规的 HTML 元素，但将用 stub 替换掉 Vue 组件。

### 测试点击事件

```js
<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="username" data-username>
      <input type="submit">
    </form>

    <div 
      class="message" 
      v-if="submitted"
    >
      {{ username }} submitted
    </div>
  </div>
</template>
<script>
  export default {
    name: "FormSubmit",

    data() {
      return {
        username: '',
        submitted: false
      }
    },

    methods: {
      handleSubmit() {
        this.submitted = true
      }
    }
  }
</script>
```

测试文件如下

```js
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
```

- 使用 `setValue` 设置一个使用了 `v-model` 的 `<input>` 的值

- 在事件上使用 `trigger`，包括使用了诸如 `prevent` 修饰符的那些

注意在调用 `trigger` 之后，有一段 `await wrapper.vm.$nextTick()`。

从 `vue-test-utils` beta 28 起，需要调用 `nextTick` 以确保 Vue 响应式更新 DOM

### 测试组件通信(prop emit)

#### 用 propsData 设置 props

`propsData` 对于 `mount` 和 `shallowMount` 都可以使用。它经常被用于测试从父组件中接受属性（props）的组件。

`propsData` 会以下面的形式被传入 `shallowMount` 或 `mount` 的第二个参数中：

```js
const wrapper = shallowMount(Foo, {
  propsData: {
    foo: 'bar'
  }
})
```

创建一个简单的 组件，有着 `msg` 和 `isAdmin` 两种 props。取决于 `isAdmin` 属性的值，该组件将以如下两种状态中的一种包含一个 `<span>`：

- `Not Authorized`：若 `isAdmin` 为 false (或者没有传入到 props 中)
- `Admin Privileges`：若 `isAdmin` 为 true

```js
<template>
  <div>
    <span v-if="isLogin">{{username}},hello</span>
    <span v-else>hello</span>
  </div>
</template>

<script>
export default {
  name: "PropTest",

  props: {
    username: {
      type: String,
      default: ''
    },
    isLogin: {
      type: Boolean,
      default: false
    }
  }
}
</script>
```

```
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
```

#### emit

emitted 语法

`emitted` 返回一个对象，其属性是已发出的各种事件。你可以通过 `emitted().[event]` 的方式检查事件：

```js
emitted().myEvent //=>  [ ['name'] ]
```

```
<template>
  <div>
  </div>
</template>

<script>
  export default {
    name: "Emitter",

    methods: { 
      emitEvent() {
        this.$emit("myEvent", "name")
      }
    }
  }
</script>

<style scoped>
</style>
```

```
import Emitter from '@/components/04-emit/Emitter.vue'
import { shallowMount } from "@vue/test-utils"

describe("Emitter", () => {
  it("emit并带一个参数", () => {
    const wrapper = shallowMount(Emitter)

    wrapper.vm.emitEvent()

    console.log(wrapper.emitted())
    //{ myEvent: [ [ 'name' ] ] }
  })
})
```

让我们对已发出的事件做一条真正的断言。

```js
it("emits an event with two arguments", () => {
  const wrapper = shallowMount(Emitter)

  wrapper.vm.emitEvent()

  expect(wrapper.emitted().myEvent[0]).toEqual(["name"])
})
```

### 常用API

#### DOM

- ```
  Wrapper.find(选择器)
  ```

  - 返回匹配选择器的第一个 `Wrapper`（DOM 节点或 Vue 组件）

- ```
  Wrapper.findAll(选择器)
  ```

  - 返回一个 `WrapperArray`

- ```
  Wrapper.findAll(选择器).at(序号)
  ```

  - 返回 `WrapperArray` 中的第 `index` 个 `Wrapper`（从 0 开始计数）

- ```
  Wrapper.is(选择器)
  ```

  - 判断 `Wrapper` 是否匹配选择器

- ```
  Wrapper.contains(选择器)
  ```

  - 判断 `Wrapper` 是否包含了一个匹配的选择器

- ```
  Wrapper.exists()
  ```

  - 判断 `Wrapper` 或 `WrapperArray` 是否存在

- ```
  Wrapper.html()
  ```

  - 返回 `Wrapper` DOM 节点的 HTML 字符串

#### 选择器

- CSS 选择器
- Vue 组件
- 选项对象
  - `{ name: 'compName' }`
  - `{ ref: 'compRef' }`

#### 断言匹配器

- `.toBe` 检查值相等
- `.toEqual` 检查对象的值
- `.toMatch` 检查字符串
- `.toContain` 检查数组
- `.toBeCloseTo` 检查浮点数
- `.toBeCalled` 检查方法被调用（`toHaveBeenCalled` 的别名）
- `.toBeCalledWith` 检查方法被调用时的参数
- `.not` 取反