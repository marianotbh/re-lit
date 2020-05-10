# 🧪 re-active (lib experiment)

basically a knockoff of knockoutjs and vue

## <span style="color: pink">#</span> what is re-active? 🤔

spur is a just another reactive library/small framework, based on the mvvm and publish/subscribe patterns. this is just an experiment for now, so please ignore

## <span style="color: pink">#</span> mount your application 🚀

creating a basic application is easy. just import `mount` from `re-active` and call it passing the node that will be used as the root for the binding context of your application as the first parameter, and optionally an object that will act as the root viewmodel (I will explain what the binding context is later on, but I believe you get the idea).

```JavaScript
import {mount} from "re-active";

const rootNode = document.querySelector("main");

mount(rootNode, {
    context: {
        user: "foo"
    }
});
```

## <span style="color: pink">#</span> reactivity ⚡

as i mentioned before, spur is based on the publish/subscribe pattern. for this, i've come up with two operators, `observable` and `computed`.

```javascript
import {observable, computed} from "re-active";

const someObservableValue = observable(1);
const someCalculatedValue = computed(() => `the value is ${observable.value}`)

observable.subscribe(val => console.log(`new value is: ${val}`))

console.log(computed.value);
observable.value = 2;
console.log(computed.value);

// will output:
// - the value is 1
// - new value is 2
// - the value is 2
```

## <span style="color: pink">#</span> using components 🧩

in order to define a component you must call `defineComponent` somewhere in your application like this: 

```javascript
import {defineComponent} from "re-active";

defineComponent("todo", {
    template: `
        <label>
            <input type="checkbox" :checked="done" />
            {{ label }}
        </label>
    `,
    viewModel: ({ id, text, done }) => ({
        label: `#${id} - ${text}`,
        done
    })
});
```
