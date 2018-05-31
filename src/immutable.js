// @flow
type PathT = null | string | number | Array<string | number>
type findItemCallbackT = (item: any) => boolean

type iterableCallbackT = (
    currentElement: any,
    key: string | number,
    parentElement: Object | Array<any>
) => any

type callbackElementT = (
    element: Object | Array<any>,
    key: string | number
) => void

/**
 * Immutable методы для работы с JS-объектом
 * @param state - Объект, над которым будут производиться операции. Передаваемый объект не будет изменен
 * @param withMutations - Если true, будет изменяться передаваемый объект
 * @author Ilya Ordin
 */
const immutable = (state: any = {}, withMutations: boolean = false) => ({
    _state: withMutations ? state : _cloneElement(state),
    _path: [],

    /**
     * Возвращает полный объект (игнорируя путь, выставленный в with)
     */
    getState: function (): any {
        return this._state
    },

    /**
     * Устанавливает путь до элемента, относительно которого будут производиться дальнейшие операции
     * @examples
     * .with(key)
     * .with([ key, key, key ])
     * @param path - Путь до элемента относительно заданного пути
     * @param savePrevPath - Если true, то путь будет браться относительно пред. пути
     */
    with: function (path: PathT, savePrevPath: boolean = false) {
        if (!savePrevPath) this.unwith()

        if (this.has(path)) {
            this._path = this._getPath(path)
        }

        return this
    },

    /**
     * Сбрасывает путь до выбранного элемента
     */
    unwith: function () {
        this._path = []
        return this
    },

    /**
     * Возвращает элемент по заданному пути
     * Если элемент не существует, возвращает undefined
     * @examples
     * .get()
     * .get(key)
     * .get([ key, key, key ])
     * @param path - Путь до элемента относительно заданного пути
     */
    get: function (path: PathT = null): any {
        let fullPath = this._getPath(path)
        let element = this._state

        for (let key of fullPath) {
            if (_hasProp(element, key)) {
                element = element[key]
            } else {
                return undefined
            }
        }

        return element
    },

    /**
     * Создает или изменяет элемент по заданному пути
     * @examples
     * .set(key, value)
     * .set([ key, key, key ], value)
     * @param path - Путь до элемента относительно заданного пути
     * @param value
     */
    set: function (path: PathT, value: any) {
        let fullPath = this._getPath(path)
        let element = this._state

        if (fullPath.length === 0) this._state = value

        for (let i = 0; i < fullPath.length; i++) {
            let key = fullPath[i]

            if (i === fullPath.length - 1) {
                element[key] = value

            } else if (_hasProp(element, key)) {
                element = element[key]

            } else {
                break;
            }
        }

        return this
    },

    /**
     * Изменяет элемент по заданному пути. Если элемент не существует, объект не меняется
     * @examples
     * .update(key, value)
     * .update([ key, key, key ], value)
     * @param path - Путь до элемента относительно заданного пути
     * @param value
     */
    update: function (path: PathT, value: any) {
        return this._getElement((element, key) => {
            element[key] = value
        }, path)
    },

    /**
     * Обновляет элементы в объекте или массиве. Используется callback для поиска элементов
     * @param callback - Callback для поиска элемента, который необходимо обновить
     * @param value
     * @param onlyFirstFound - Если true, обновляет только первый найденный элемент
     */
    updateBy: function(
        callback: findItemCallbackT,
        value: any,
        onlyFirstFound: boolean = true
    ) {
        return this._getElement((element, key) => {
            if (_isArray(element[key])) {
                for (let i = 0; i < element[key].length; i++) {
                    if (callback( element[key][i] )) {
                        element[key][i] = value
                        if (onlyFirstFound) break;
                    }
                }

            } else if (_isObject(element[key])) {
                const keys = Object.keys(element[key])

                for (let i = 0; i < keys.length; i++) {
                    if (callback( element[key][ keys[i] ] )) {
                        element[key][ keys[i] ] = value
                        if (onlyFirstFound) break;
                    }
                }
            }
        }, null, true)
    },

    /**
     * Удаляет элемент по заданному пути
     * @examples
     * .remove(key)
     * .remove([ key, key, key ])
     * @param path - Путь до элемента относительно заданного пути
     */
    remove: function (path: PathT) {
        return this._getElement((element, key) => {
            if (_isArray(element)) {
                element.splice(key, 1)

            } else if (_isObject(element)) {
                delete element[key]
            }

        }, path)
    },

    /**
     * Удаляет элементы в объекте или массиве. Используется callback для поиска элементов
     * @param callback - Callback для поиска элемента, который необходимо удалить
     * @param onlyFirstFound - Если true, удаляет только первый найденный элемент
     */
    removeBy: function (callback: findItemCallbackT, onlyFirstFound: boolean = true) {
        return this._getElement((element, key) => {
            if (_isArray(element[key])) {
                for (let i = 0; i < element[key].length; i++) {
                    if (callback( element[key][i] )) {
                        element[key].splice(i, 1)
                        if (onlyFirstFound) break;
                    }
                }

            } else if (_isObject(element[key])) {
                const keys = Object.keys(element[key])

                for (let i = 0; i < keys.length; i++) {
                    if (callback( element[key][ keys[i] ] )) {
                        delete element[key][ keys[i] ]
                        if (onlyFirstFound) break;
                    }
                }
            }
        }, null, true)
    },

    /**
     * Обновляет ключ по заданному пути
     * @examples
     * .updateKey(key, newKey)
     * .updateKey([ key, key, key ], newKey)
     * @param path - Путь до элемента относительно заданного пути
     * @param newKey - Новый ключ
     */
    updateKey: function (path: PathT, newKey: string | number) {
        return this._getElement((element, key) => {
            element[newKey] = element[key]
            delete element[key]
        }, path)
    },

    /**
     * Объединяет элементы в объекте или массиве
     * @param data
     * @param path - Путь до элемента относительно заданного пути
     */
    merge: function (data: Object | Array<any>, path: PathT = null) {
        data = _cloneElement(data)

        return this._getElement((element, key) => {
            if (_isObject(element[key]) && _isObject(data)) element[key] = { ...element[key], ...data }
            else if (_isArray(element[key]) && _isArray(data)) element[key] = [ ...element[key], ...data ]
        }, path, true)
    },

    /**
     * Добавляет новый элемент в массиве
     * @param value
     * @param path - Путь до элемента относительно заданного пути
     */
    push: function (value: any, path: PathT = null) {
        return this._getElement((element, key) => {
            if (_isArray(element[key])) {
                element[key].push(value)
            }
        }, path, true)
    },

    /**
     * forEach по объекту или массиву по заданному пути
     * @param callback
     * @param path - Путь до элемента относительно заданного пути
     */
    forEach: function (callback: iterableCallbackT, path: PathT = null) {
        return this._getElement((element, key) => {
            for (let localKey in element[key]) {
                if (element[key].hasOwnProperty(localKey)) {
                    callback( immutable(element[key][localKey], true), localKey, element[key] )
                }
            }
        }, path, true)
    },

    /**
     * filter по объекту или массиву по заданному пути
     * @param callback
     * @param path - Путь до элемента относительно заданного пути
     */
    filter: function (callback: iterableCallbackT, path: PathT = null) {
        return this._getElement((element, key) => {
            if (_isObject(element[key])) {
                element[key] = Object.keys(element[key])
                    .filter( localKey => callback(element[key][localKey], localKey, element[key]) )
                    .reduce( (res, localKey) => Object.assign(res, { [localKey]: element[key][localKey] }), {} )

            } else if (_isArray(element[key])) {
                element[key] = element[key].filter(callback)
            }
        }, path, true)
    },

    /**
     * Проверяет существование элемента по заданному пути
     * @param path - Путь до элемента относительно заданного пути
     */
    has: function (path: PathT): boolean {
        const fullPath = this._getPath(path)
        let element = this._state

        for (let key of fullPath) {
            if (_hasProp(element, key)) {
                element = element[key]
            } else {
                return false
            }
        }

        return true
    },

    /**
     * Возвращает полный путь до элемента
     * @param path - Путь до элемента относительно заданного пути
     * @private
     */
    _getPath: function (path: PathT = null): Array<string | number> {
        if (path === null) {
            return this._path

        } else if (_isArray(path)) {
            return this._path.concat(path)

        } else {
            return [ ...this._path, path ]
        }
    },

    /**
     * Возвращает в callback элемент с ключем по заданному пути для чтения и записи, если элемент существует
     * @param callback
     * @param path - Путь до элемента относительно заданного пути
     * @param withRoot - Если true, при пустом пути возвращает корень
     * @private
     */
    _getElement: function (
        callback: callbackElementT,
        path: PathT = null,
        withRoot: boolean = false
    ) {
        let fullPath = this._getPath(path)
        let element = this._state

        if (withRoot && fullPath.length === 0) callback(this, '_state')

        for (let i = 0; i < fullPath.length; i++) {
            let key = fullPath[i]

            if (_hasProp(element, key)) {
                if (i === fullPath.length - 1) {
                    callback(element, key)
                } else {
                    element = element[key]
                }
            } else {
                break;
            }
        }

        return this
    },
})

/**
 * Проверяет является ли элемент объектом
 * @param element
 * @private
 */
export const _isObject = (element: any): boolean => {
    return element !== null &&
        Object.prototype.toString.call(element) === '[object Object]'
}

/**
 * Проверяет является ли элемент массивом
 * @param element
 * @private
 */
export const _isArray = (element: any): boolean => {
    return element instanceof Array ||
        Object.prototype.toString.call(element) === '[object Array]'
}

/**
 * Клонирует элемент
 * @param object
 * @private
 */
const _cloneElement = (object: any): any => {
    return JSON.parse(JSON.stringify(object))
}

/**
 * Проверяет наличие свойства у объекта или индекса в массиве
 * @param element
 * @param key
 * @private
 */
const _hasProp = (element: Object | Array<any>, key: any) => {
    return _isObject(element) && element.hasOwnProperty(key) ||
        _isArray(element) && element[key] !== undefined
}

export default immutable