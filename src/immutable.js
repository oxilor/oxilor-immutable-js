/**
 * Immutable методы для работы с JS-объектом
 * @param state - Объект, над которым будут производиться операции. Передаваемый объект не будет изменен
 * @param withMutations - Если true, будет изменяться передаваемый объект
 * @author Ilya Ordin
 */
const immutable = (state = {}, withMutations = false) => ({
    _state: withMutations ? state : _cloneElement(state),
    _path: [],
    /**
     * Возвращает измененный state в виде JS объекта
     * Игнорирует путь, выставленный в with
     */
    getState: function () {
        return this._state;
    },
    /**
     * Устанавливает путь до элемента, относительно которого будут производиться дальнейшие операции
     * @examples
     * .with(key)
     * .with([ key, key, key ])
     * @param path - Путь до элемента относительно заданного пути
     * @param savePrevPath - Если true, то путь будет браться относительно пред. пути
     */
    with: function (path, savePrevPath = false) {
        if (!savePrevPath)
            this.unwith();
        if (this.has(path)) {
            this._path = this._getPath(path);
        }
        return this;
    },
    /**
     * Сбрасывает путь до выбранного элемента
     */
    unwith: function () {
        this._path = [];
        return this;
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
    get: function (path = null) {
        let fullPath = this._getPath(path);
        let element = this._state;
        for (let key of fullPath) {
            if (_hasProp(element, key)) {
                element = element[key];
            }
            else {
                return undefined;
            }
        }
        return element;
    },
    /**
     * Создает или изменяет элемент по заданному пути
     * @examples
     * .set(key, value)
     * .set([ key, key, key ], value)
     * @param path - Путь до элемента относительно заданного пути
     * @param value
     */
    set: function (path, value) {
        let fullPath = this._getPath(path);
        let element = this._state;
        if (fullPath.length === 0)
            this._state = value;
        for (let i = 0; i < fullPath.length; i++) {
            let key = fullPath[i];
            if (i === fullPath.length - 1) {
                element[key] = value;
            }
            else if (_hasProp(element, key)) {
                element = element[key];
            }
            else {
                break;
            }
        }
        return this;
    },
    /**
     * Изменяет элемент по заданному пути
     * В отличии от set, если элемент не существует, state не меняется
     * @examples
     * .update(key, value)
     * .update([ key, key, key ], value)
     * @param path - Путь до элемента относительно заданного пути
     * @param value
     */
    update: function (path, value) {
        return this._getElement((element, key) => {
            element[key] = value;
        }, path);
    },
    /**
     * Обновляет элементы в объекте или массиве, используя callback для поиска элементов
     * @param callback - Callback для поиска элемента, который необходимо обновить
     * @param value
     * @param onlyFirstFound - Если true, обновляет только первый найденный элемент
     */
    updateBy: function (callback, value, onlyFirstFound = true) {
        return this._getElement((element, key) => {
            if (_isArray(element[key])) {
                for (let i = 0; i < element[key].length; i++) {
                    if (callback(element[key][i])) {
                        element[key][i] = value;
                        if (onlyFirstFound)
                            break;
                    }
                }
            }
            else if (_isObject(element[key])) {
                const keys = Object.keys(element[key]);
                for (let i = 0; i < keys.length; i++) {
                    if (callback(element[key][keys[i]])) {
                        element[key][keys[i]] = value;
                        if (onlyFirstFound)
                            break;
                    }
                }
            }
        }, null, true);
    },
    /**
     * Удаляет элемент по заданному пути
     * @examples
     * .remove(key)
     * .remove([ key, key, key ])
     * @param path - Путь до элемента относительно заданного пути
     */
    remove: function (path) {
        return this._getElement((element, key) => {
            if (_isArray(element)) {
                // @ts-ignore
                element.splice(key, 1);
            }
            else if (_isObject(element)) {
                delete element[key];
            }
        }, path);
    },
    /**
     * Удаляет элементы в объекте или массиве, используя callback для поиска элементов
     * @param callback - Callback для поиска элемента, который необходимо удалить
     * @param onlyFirstFound - Если true, удаляет только первый найденный элемент
     */
    removeBy: function (callback, onlyFirstFound = true) {
        return this._getElement((element, key) => {
            if (_isArray(element[key])) {
                for (let i = 0; i < element[key].length; i++) {
                    if (callback(element[key][i])) {
                        element[key].splice(i, 1);
                        if (onlyFirstFound)
                            break;
                    }
                }
            }
            else if (_isObject(element[key])) {
                const keys = Object.keys(element[key]);
                for (let i = 0; i < keys.length; i++) {
                    if (callback(element[key][keys[i]])) {
                        delete element[key][keys[i]];
                        if (onlyFirstFound)
                            break;
                    }
                }
            }
        }, null, true);
    },
    /**
     * Обновляет ключ по заданному пути
     * @examples
     * .updateKey(key, newKey)
     * .updateKey([ key, key, key ], newKey)
     * @param path - Путь до элемента относительно заданного пути
     * @param newKey - Новый ключ
     */
    updateKey: function (path, newKey) {
        return this._getElement((element, key) => {
            element[newKey] = element[key];
            delete element[key];
        }, path);
    },
    /**
     * Объединяет элементы в объекте или массиве
     * @param data
     * @param path - Путь до элемента относительно заданного пути
     */
    merge: function (data, path = null) {
        data = _cloneElement(data);
        return this._getElement((element, key) => {
            if (_isObject(element[key]) && _isObject(data)) {
                element[key] = Object.assign({}, element[key], data);
            }
            else if (_isArray(element[key]) && _isArray(data)) {
                // @ts-ignore
                element[key] = [...element[key], ...data];
            }
        }, path, true);
    },
    /**
     * Добавляет новый элемент в массиве
     * @param value
     * @param path - Путь до элемента относительно заданного пути
     */
    push: function (value, path = null) {
        return this._getElement((element, key) => {
            if (_isArray(element[key])) {
                element[key].push(value);
            }
        }, path, true);
    },
    /**
     * Аналог forEach по объекту или массиву по заданному пути
     * @param callback
     * @param path - Путь до элемента относительно заданного пути
     */
    forEach: function (callback, path = null) {
        return this._getElement((element, key) => {
            for (let localKey in element[key]) {
                if (element[key].hasOwnProperty(localKey)) {
                    callback(immutable(element[key][localKey], true), localKey, element[key]);
                }
            }
        }, path, true);
    },
    /**
     * Аналог filter по объекту или массиву по заданному пути
     * @param callback
     * @param path - Путь до элемента относительно заданного пути
     */
    filter: function (callback, path = null) {
        return this._getElement((element, key) => {
            if (_isObject(element[key])) {
                element[key] = Object.keys(element[key])
                    .filter(localKey => callback(element[key][localKey], localKey, element[key]))
                    .reduce((res, localKey) => Object.assign(res, { [localKey]: element[key][localKey] }), {});
            }
            else if (_isArray(element[key])) {
                element[key] = element[key].filter(callback);
            }
        }, path, true);
    },
    /**
     * Проверяет существование элемента по заданному пути
     * @param path - Путь до элемента относительно заданного пути
     */
    has: function (path) {
        const fullPath = this._getPath(path);
        let element = this._state;
        for (let key of fullPath) {
            if (_hasProp(element, key)) {
                element = element[key];
            }
            else {
                return false;
            }
        }
        return true;
    },
    /**
     * Возвращает полный путь до элемента
     * @param path - Путь до элемента относительно заданного пути
     * @private
     */
    _getPath: function (path = null) {
        if (path === null) {
            return this._path;
        }
        else if (_isArray(path)) {
            return this._path.concat(path);
        }
        else {
            // @ts-ignore
            return [...this._path, path];
        }
    },
    /**
     * Возвращает в callback элемент с ключем по заданному пути для чтения и записи, если элемент существует
     * @param callback
     * @param path - Путь до элемента относительно заданного пути
     * @param withRoot - Если true, при пустом пути возвращает корень
     * @private
     */
    _getElement: function (callback, path = null, withRoot = false) {
        let fullPath = this._getPath(path);
        let element = this._state;
        if (withRoot && fullPath.length === 0)
            callback(this, '_state');
        for (let i = 0; i < fullPath.length; i++) {
            let key = fullPath[i];
            if (_hasProp(element, key)) {
                if (i === fullPath.length - 1) {
                    callback(element, key);
                }
                else {
                    element = element[key];
                }
            }
            else {
                break;
            }
        }
        return this;
    },
});
/**
 * Проверяет является ли элемент объектом
 * @param element
 * @private
 */
export const _isObject = (element) => {
    return element !== null &&
        Object.prototype.toString.call(element) === '[object Object]';
};
/**
 * Проверяет является ли элемент массивом
 * @param element
 * @private
 */
export const _isArray = (element) => {
    return element instanceof Array ||
        Object.prototype.toString.call(element) === '[object Array]';
};
/**
 * Клонирует элемент
 * @param object
 * @private
 */
const _cloneElement = (object) => {
    return JSON.parse(JSON.stringify(object));
};
/**
 * Проверяет наличие свойства у объекта или индекса в массиве
 * @param element
 * @param key
 * @private
 */
const _hasProp = (element, key) => {
    return _isObject(element) && element.hasOwnProperty(key) ||
        _isArray(element) && element[key] !== undefined;
};
export default immutable;
//# sourceMappingURL=immutable.js.map