# oxilor-immutable-js
Данная библиотека разрабатывалась для работы с Redux (для изменения состояний в reducers), но также может использоваться и для других целей, где требуется неизменяемость данных.

Данные хранятся в виде простых типов JS. Поэтому не требуются какие-либо дополнительные преобразования перед сохранением новых состояний (например, при использовании redux-persist).


## Установка
Используя Yarn:
```
yarn add oxilor-immutable-js
```
Используя npm:
```
npm install oxilor-immutable-js
```


## Пример использования
```js
import immutable from 'oxilor-immutable-js'

// Например, сейчас в state у нас хранится 2 пользователя
const state = {
    'id1': {
        name: 'Ilya',
        surname: 'Ordin',
        email: null
    },
    'id2': {
        name: 'John',
        surname: 'Smith',
        email: 'john.smith@iordin.com'
    }
}

// И нам нужно у пользователя Ilya Ordin поменять почту на ilya.ordin@iordin.com
const nextState = immutable(state)
    .with('id1')
    .set('email', 'ilya.ordin@iordin.com')
    .getState()
```
immutable возвращает новый state с измененной почтой. Этот state можно использовать для следующего состояния Redux. Старый state не изменился.


## Методы
При вызове immutable необходимо передать объект, который необходимо изменить. По умолчанию передаваемый объект полностью клонируется (создается новый объект, в котором будут производиться изменения). 

Если во втором параметре withMutations передать true, то все изменения будут происходить непосредственно с передаваемым объектом.
```js
const state = {
    email: null
}

// Возвращает новый объект state с измененным email. Старый state не изменился. 
const nextState = immutable(state)
    .set('email', 'ilya.ordin@iordin.com')
    .getState()

// Возвращает тот же state (ссылку на него) с измененным email. Старый state изменился.
const nextState = immutable(state, true)
    .set('email', 'ilya.ordin@iordin.com')
    .getState()
```


### getState
Возвращает новый state в виде JS объекта. Игнорирует путь, выставленный в with (подробнее о методе with ниже).


### with
Устанавливает путь до элемента, относительно которого будут производиться дальнейшие операции.
```js
const state = {
    'id1': {
        email: null,
        stats: {
            taskCompleted: 10
        }
    },
    'id2': {
        email: null,
        stats: {
            taskCompleted: 0
        }
    }
}

// Возвращает новый state, в котором email у объекта id1 равен ilya.ordin@iordin.com
immutable(state)
    .with('id1')
    .set('email', 'ilya.ordin@iordin.com')
    .getState()

// Возвращает новый state, в котором taskCompleted у объекта id1 равен 11
immutable(state)
    .with(['id1', 'stats'])
    .set('taskCompleted', 11)
    .getState()
```

По умолчанию with каждый раз выставляет путь до элемента относительно корня. 
```js
// Меняет email в объектах id1 и id2. Возвращает новый state.
immutable(state)
    .with('id1').set('email', 'ilya.ordin@iordin.com')
    .with('id2').set('email', 'john.smith@iordin.com')
    .getState()
```

Если необходимо добавить путь к заданному ранее, необходимо во втором параметре savePrevPath передать true.
```js
// Меняет taskCompleted в объекте id1. Возвращает новый state.
immutable(state)
    .with('id1')
    .with('stats', true)
    .set('taskCompleted', 11)
    .getState()

// Аналог
immutable(state)
    .with(['id1', 'stats'])
    .set('taskCompleted', 11)
    .getState()
```


### unwith
Сбрасывает путь до выбранного элемента.
```js
const state = {
    'id1': {
        email: null
    },
    'id2': {
        email: null
    }
}

// Возвращает state, в котором email у объекта id1 равен ilya.ordin@iordin.com и в state установлен параметр sort = asc
immutable(state)
    .with('id1').set('email', 'ilya.ordin@iordin.com')
    .unwith()
    .set('sort', 'asc')
    .getState()
```


### get
Возвращает элемент по заданному пути. Если элемент не существует, возвращает undefined.
```js
const state = {
    'id1': {
        email: null,
        stats: {
            taskCompleted: 10
        }
    }
}

// Три варианта получения email
immutable(state).with('id1').get('email')
immutable(state).with(['id1', 'email']).get()
immutable(state).get(['id1', 'email'])
```


### set
Создает или изменяет элемент по заданному пути.
```js
const state = {
    'id1': {
        email: null,
        stats: {
            taskCompleted: 10
        }
    }
}

// Два варианта замены email, используя set. Возвращает новый state.
immutable(state).with('id1').set('email', 'ilya.ordin@iordin.com').getState()
immutable(state).set(['id1', 'email'], 'ilya.ordin@iordin.com').getState()

// Добавление объекта id2, который равен null. Возвращает новый state.
immutable(state).set('id2', null).getState()
```


### update
Изменяет элемент по заданному пути. В отличии от set, если элемент не существует, state не меняется.
```js
const state = {
    'id1': {
        email: null
    }
}

// Два варианта замены email, используя update. Возвращает новый state.
immutable(state).with('id1').update('email', 'ilya.ordin@iordin.com').getState()
immutable(state).update(['id1', 'email'], 'ilya.ordin@iordin.com').getState()

// Пытаемся обновить несуществующий объект с id2. Возвращает тот же state.
immutable(state).update('id2', null).getState()
```


### updateBy
Обновляет элементы в объекте или массиве, используя callback для поиска элементов
```js
const state = {
    'id1': {
        color: 'white'
    },
    'id2': {
        color: 'black'
    },
    'id3': {
        color: 'white'
    },
}

// Меняет color с white на red. Меняет все найденные объекты.
immutable(state).updateBy(item => item.color === 'white', { color: 'red' }).getState()
```

Если нужно изменить color только в первом найденном элементе, необходимо в третьем параметре onlyFirstFound передать true.
```js
immutable(state).updateBy(item => item.color === 'white', { color: 'red' }, true).getState()
```


### remove
Удаляет элемент по заданному пути.
```js
const state = {
    'id1': {
        email: 'ilya.ordin@iordin.com'
    },
    'id2': {
        email: 'john.smith@iordin.com'
    }
}

// Два варианта удаления email. Возвращает новый state.
immutable(state).with('id1').remove('email').getState()
immutable(state).remove(['id1', 'email']).getState()

// Удаление объекта id2. Возвращает новый state.
immutable(state).remove('id2').getState()
```


### removeBy
Удаляет элементы в объекте или массиве, используя callback для поиска элементов.
```js
const state = {
    'id1': {
        age: 15
    },
    'id2': {
        age: 16
    },
    'id3': {
        age: 26
    },
}

// Удаляет все объекты, в которых age < 18. Возвращает новый state.
immutable(state).removeBy(item => item.age < 18).getState()
```

Если нужно удалить только первый найденный объект, необходимо во втором параметре onlyFirstFound передать true.
```js
immutable(state).removeBy(item => item.age < 18, true).getState()
```


### updateKey
Обновляет ключ по заданному пути.
```js
const state = {
    'id1': {
        email: 'ilya.ordin@iordin.com'
    }
}

// Изменяем id1 на id2. Возвращает новый state.
immutable(state).updateKey('id1', 'id2').getState()

// Два варианта изменения email на second_email. Возвращает новый state.
immutable(state).with('id1').updateKey('email', 'second_email').getState()
immutable(state).updateKey(['id1', 'email'], 'second_email').getState()
```


### merge
Объединяет элементы в объекте или массиве.
```js
const state = {
    'id1': {
        name: 'Ilya',
        email: 'ilya.ordin@iordin.com'
    }
}

const data = {
    name: 'Ilya',
    surname: 'Ordin'
}

// Добавляем в state параметр sort. Возвращает новый state.
immutable(state).merge({ 'sort': 'asc' }).getState()

// Два варианта объединения объекта id1 с data. Возвращает новый state.
immutable(state).with('id1').merge(data).getState()
immutable(state).merge(data, 'id1').getState() // Вторым параметром можно передавать путь до нужного объекта в виде массива
```


### push
Добавляет новый элемент в массиве.
```js
const state = {
    'id1': {
        email: 'ilya.ordin@iordin.com',
        permissions: ['CAN_CHANGE_STATUS']
    }
}

// Добавляем в permissions CAN_CREATE_NEW_TASKS. Возвращает новый state.
immutable(state).with(['id1', 'permissions']).push('CAN_CREATE_NEW_TASKS').getState()
```

### forEach
Аналог forEach по объекту или массиву по заданному пути. В forEach можно изменять элементы.
```js
const state = {
    'id1': {
        age: 15,
        hasAccess: false
    },
    'id2': {
        age: 16,
        hasAccess: false
    },
    'id3': {
        age: 26,
        hasAccess: false
    },
}

// Изменяем hasAccess на true в тех объектах, в которых age >= 18. Возвращает новый state.
immutable(state).forEach(item => {
    if (item.age >= 18) {
        item.set('hasAccess', true)
    }
}).getState()
```

Во втором параметре можно передать путь до объекта, в котором необходимо применить forEach.
```js
const state = {
    byId: {
        'id1': {
            age: 15,
            hasAccess: false
        },
        'id2': {
            age: 16,
            hasAccess: false
        },
        'id3': {
            age: 26,
            hasAccess: false
        },
    },
    ids: ['id1', 'id2']
}

immutable(state).forEach(item => {
    if (item.age >= 18) {
        item.set('hasAccess', true)
    }
}, 'byId').getState()
```


### filter
Аналог filter по объекту или массиву по заданному пути.
```js
const state = {
    'id1': {
        age: 15,
        hasAccess: false
    },
    'id2': {
        age: 16,
        hasAccess: false
    },
    'id3': {
        age: 26,
        hasAccess: true
    },
}

// Оставляем только те объекты, в которых hasAccess равен true. Возвращает новый state.
immutable(state).filter(item => item.hasAccess).getState()
```

По аналогии с forEach во втором параметре можно передать путь до объекта, в котором необходимо применить filter.


### has
Проверяет существование элемента по заданному пути. Возвращает boolean.
```js
const state = {
    'id1': {
        name: 'Ilya',
        surname: 'Ordin',
        email: 'ilya.ordin@iordin.com'
    },
}

// Возвращает true
immutable(state).has('id1')
immutable(state).has(['id1', 'name'])
immutable(state).with('id1').has('name')

// Возвращает false
immutable(state).has('id2')
immutable(state).has(['id1', 'age'])
immutable(state).with('id1').has('age')
```