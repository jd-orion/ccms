#### immer

Immer是一个简单易用、体量小巧、设计巧妙的immutable 库，以最小的成本实现了js的不可变数据结构。

Js的对象是引用类型的，在使用过程中常常会不经意的修改。为了解决这个问题，除了可以使用深度拷贝的方法（但成本高，影响性能），还可以使用一些不可变数据结构的库，Immer就是其中的佼佼者。
immer基于copy-on-write机制——在当前的状态数据上复制出一份临时的草稿，然后对这份草稿修改，最后生成新的状态数据。借力于ES6的Proxy，跟响应式的自动跟踪是一样的。
https://immerjs.github.io/immer/api

#### immer写法

```js
import produce from "immer"

this.state = {
  members: [{name: 'user', age: 18}]
}

// 一般写法
this.setState(state=>{
  return produce(state,draft=>{
    draft.members[0].age++;
  })
})
// 高阶写法
this.setState(state=>{
  return produce(draft=>{
    draft.members[0].age++;
  })(state) 
})
// 简洁写法
this.setState(produce(draft => {
  draft.members[0].age++;
}))
```
#### immer拓展
1. 返回值问题
以高阶函数写法为例
语法:produce(recipe: (draftState) => void | draftState, ?PatchListener)(currentState): nextState
recipe 是否有返回值，nextState 的生成过程是不同的：
- recipe 没有返回值时：nextState是根据recipe 函数内的 draftState生成的；
- recipe有返回值时：nextState是根据 recipe 函数的返回值生成的

了解了这些，方便在开发中更加灵活地运用immer
2. Auto freezing（自动冻结）
Immer 会自动冻结使用 produce 修改过的状态树，这样可以防止在变更函数外部修改状态树。这个特性会带来性能影响，所以需要在生产环境中关闭。可以使用 setAutoFreeze(true / false) 打开或者关闭。在开发环境中建议打开，可以避免不可预测的状态树更改
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze

#### immer结合shouldComponentUpdate做了哪些事？
 SCU的对于引用类型对象的比较，如果通过比较它们的值往往很耗费性能，有了数据结构共享，我们可以通过比较复杂对象的每一个节点的指针指向是否相同，大大节省性能损耗

#### 项目中数据依赖字段上报规则及注意record（当前记录）注意事项
1. 每一个组件在handleMount以后知道它们的this.props.containerPath和自身的field路径，以containerPath字段向下传递给子组件，我们在paramHelper里面对应record里的依赖项的处理是，拿到父级的路径和record依赖的字段(举例为DepField),通过getChainPath(this.props.containerPath, DepField)拿到完整的链式路径，onReportFields上报给父组件有哪些依赖项,参见下：

containerPath=this.props.containerPath+field ----传递子组件--->  containerPath=this.props.containerPath+field
父组件  <----onReportFields---  getChainPath(this.props.containerPath, DepField)

2. 正常来说，父组件的value就是子组件的record, 特殊的是tabs和form两个组件对应分别多了tab.field和index,这里通过Helper传递record时，取值分别对应下探到tab.field和index。
示例:

```js
// import_subform和group用法:
ConditionHelper(formFieldConfig.condition, { record: this.props.value,...})
ConditionHelper(formFieldConfig.condition, { record: this.props.value,...})
// tabs和form用法:
ConditionHelper(formFieldConfig.condition, { record: this.props.value[tab.field],...})
ConditionHelper(formFieldConfig.condition, { record: this.props.value[index],...})
```