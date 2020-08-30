# 🧪 re-lit

a more functional approach to lit-html, inspired by React and Vue.

## 🤔 what is re-lit?

re-lit is yet another reactive UI library/framework, based on lit-html but mostly inspired on React's and Vue's approach to functional components.

## 🚀 getting started

install through npm

```
npm install re-lit
```

## ⚡ reactivity

just like Vue under the hood, re-lit is based on the publish/subscribe pattern. unlike React, components are not re-rendered everytime one of their dependencies change. instead, only the parts that depend on observable will update when required.

in order to handle reactivity inside your components, we have two operators: `observe` (also exported as `of` for easier use) and `compose`, if you're familiar with Vue's composition API,
these are your very own `ref` and `computed` functions. and you'll find they work very similarly:

- `observe` stores a primitive value that can be subscribed to, and that will trigger
  effect updates everytime its value is updated.
- `compose` takes in a function that will be re-evaluated everytime one of its dependencies change.

heres how you use them:

```typescript
import { observe, compose } from 're-lit'

const firstName = observe('')
const lastName = observe('')

// in order to trigger dependency tracking, you have to access the observable's value
const fullName = compose(() => firstName.value + ' ' + lastName.value)

console.log(fullName.value) // first read outputs: ''

// update its dependencies:
firstName.value = 'Jane' // fullName's value is now 'Jane '
lastName.value = 'Doe' // fullName's value is now 'Jane Doe'

console.log(fullName.value) // second read outputs: 'Jane Doe'
```

you can also subscribe to these operators to perform some side logic whenever their values are updated:

```typescript
import { observe } from 're-lit'

const username = observe('')
const password = observe('')

username.subscribe(async value => {
  const isAvailable = await fetch(`http://some-validation-api.com?username=${value}`).then(res => res.json())
  if (!isAvailable) alert('username taken!!')
})

password.subscribe(value => {
  const isStrong = somePasswordTestingLogic(value)
  if (!isStrong) alert('password is too weak!!')
})
```

## 🧩 components

components are a basic part of every UI framework. they reduce the size of your files and delegate logical responsibility into smaller pieces of code that are easier to read, test and mantain.

to define a new component in re-lit you need to import two things: `html` and `createElement`.

- `html`: if you're familiar with [lit-element](https://lit-element.polymer-project.org/) or [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) , this function is does pretty much the same. under the hood, it converts the template string into a DocumentFragment element

* `createElement`: because components in re-lit can have multiple root elements, this helper function basically creates a reference point for the component in the DOM, where all loose subscriptions will be attached to when the component is created, and disposed with when it's removed from the DOM.

```typescript
// Todo.ts
import { createElement, html } from 're-lit'

type TodoProps = {
  text: string
  done: boolean
}

export default createElement<TodoProps>(
  ({ text, done }) =>
    html`
      <label>
        <input type="checkbox" checked=${done} />
        ${text}
      </label>
    `
)
```

use your component from another component like so:

```typescript
import { createElement, html, observe } from 're-lit'
import Todo from './Todo'

const TodoList = createElement(() => {
  // for the sake of the example use any[]
  const todos = observe<any[]>([])

  (async () => {
    const todos.value = await fetch('...').then(res => res.json())
  })()

  return html`
    <div id="todos-container">
      ${todos.value.map(Todo)}
    </div>
  `
})

export default TodoList
```

creating a basic application is easy. just import `render` and pass a template as the first parameter, the second parameter is the root node where the template will be appended.
i bet this looks pretty familiar already.

```typescript
import { render, html } from 're-lit'
import TodoList from './components/TodoList'

const App = () => html`
  <h1>hello, world!</h1>
  <div>${TodoList()}</div>
`

render(App(), document.body)
```

## ⚙ template literals

in some of the examples above you've seen some of the possible ways in which you can define template literals, in this section we'll review them all

### 👉 attributes

pass an object inside the elements tag to set its attributes, passing null as value to a key will not set or remove an attribute, passing a function or an observable will cause the attribute to be updated with its dependencies:

```typescript
import { html, observe } from 're-lit'

const isDisabled = observe(false)

const template = html`
  <button
    ${{
      id: 'clickity',
      type: 'button',
      // return null to remove the attribute or it should not be added:
      disabled: () => (isDisabled.value ? "true" : null)
      // this will work too, but will leave an empty attribute
      // if provided a falsy value different to null:
      disabled: isDisabled
      // this will not be reactive:
      disabled: isDisabled.value
    }}
  >
    hello, world
  </button>
`
```

### 👉 properties

similar to React, properties' bindings only work one-way. this means that the property will be updated when the observable changes value, but the observable will not be updated when the property changes value:

```typescript
import { html, observe } from 're-lit'

const inputValue = observe('')

const template = html`<input type="text" value=${inputValue} />`
```

### 👉 events

events in re-lit don't require any special syntax, unlike vue or lit-html do with @ syntax, simply define attribute with the 'on' prefix and set the value to a function that will receive the event itself as only parameter.

following the last example:

```typescript
import { html, observe } from 're-lit'

const inputValue = observe('')

// sadly it's not possible through generics to define the event target's type
// so, if you're using TypeScript, some casting has to be done for this part
const template = html`
  <input
    type="text"
    value=${inputValue}
    onchange=${(ev: Event) => (inputValue.value = (ev.target as HTMLInputElement).value)}
  />
`
```

### 👉 nested templates

using components inside other components is easy with re-lit. since components are simply functions that return a DocumentFragment, you can pretty much append them to any element in the DOM, but using interpolation makes it much easier:

```typescript
import { html, observe } from 're-lit'

// using plain templates:

const childTemplate = html`
  <div>
    hello, world!
  </div>
`

const parentTemplate = html`
  <div>
    ${childTemplate}
  </div>
`

// nesting element templates:

const ChildElement = createElement(({ who }) => html` <p>hello, ${who}</p> `)

const ParentElement = createElement(() => html` <div>${ChildElement({ who: 'world' })}</div> `)

// conditional templates:

const Dashboard = createElement(() => {
  const isLoggedIn = observe(false)

  return html`${() => (isLoggedIn.value ? ChildElement({ who: 'user' }) : null)}`
})

// arrays of templates:

const TodoList = createElement(() => {
  const todos = observe([
    { text: 'play games', done: true },
    { text: 'work', done: false }
    { text: 'work on personal projects instead of working', done: true },
  ])

  return html`
    <div>
      ${() => todos.value.map(todo =>
        html`
          <label>
            ${todo.text}
            <input type="checkbox" checked=${todo.done}
          </label>
        `
      )}
    </div>
  `
})
```

### 👉 referencing an element

there's not many use cases for this, but since we're working with actual DOM Nodes, you could use querySelector or anything you'd prefer to obtain a reference to any of the nodes defined inside a template string like this:

```typescript
const complexTemplate = html`
  <div>
    <p>
      <small>get me!!</small>
      <small>not me</small>
    </p>
    <p>...</p>
  </div>
`

const gotYou = complexTemplate.querySelector('div p:first-child small:first-child')

console.log(gotYou.textContent)
```

but that's boring, when we can just pass a function to the tag to obtain the node we want to treat in any particular way:

```typescript
import { html } from 're-lit'

const complexTemplate = html`
  <div>
    <p>
      <small ${gotYou => console.log(gotYou.textContent)}>get me!!</small>
      <small>not me</small>
    </p>
    <p>...</p>
  </div>
`
```

## 🤓 a little context and disclaimer

coming from React, i've been loving the DX it has to offer. when i discovered Polymer i really loved the idea of "framework-agnostic" components. but working with classes and lifecycles all over was kinda off-putting and i never really found a good use for Shadow DOM, so it was mostly an annoyance and required a .
this is mostly an experiment i've worked on for fun because i've always been interested on how reactive frameworks work. ever since i've
started working with KnockoutJS in my first job. feedback is welcome but this is just a hobby, i'll keep working on it on my free time and probably scrap it all over when
