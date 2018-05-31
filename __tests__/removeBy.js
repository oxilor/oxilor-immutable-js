import immutable from '../src/immutable'

const mockObjectState = {
    'id1': { name: 'White' },
    'id2': { name: 'Black' },
}

const mockArrayState = {
    list: [
        { name: 'White' },
        { name: 'Black' },
    ]
}

describe('Тестирование removeBy', () => {
    test('Удаление элемента в объекте (без with)', () => {
        const nextState = immutable(mockObjectState)
        nextState.removeBy(item => item.name === 'Black')
        expect(nextState.getState()).toEqual({
            'id1': { name: 'White' },
        })
    })

    test('Удаление элемента в массиве (с with)', () => {
        const nextState = immutable(mockArrayState)
        nextState.with('list')
        nextState.removeBy(item => item.name === 'Black')
        expect(nextState.getState()).toEqual({
            list: [
                { name: 'White' },
            ]
        })
    })

    test('Удаление первого найденного элемента в массиве', () => {
        const nextState = immutable([
            { name: 'White', age: 20 },
            { name: 'Black', age: 90 },
            { name: 'White', age: 40 },
        ])
        nextState.removeBy(item => item.name === 'White')
        expect(nextState.getState()).toEqual([
            { name: 'Black', age: 90 },
            { name: 'White', age: 40 },
        ])
    })

    test('Удаление всех найденных элементов в массиве', () => {
        const nextState = immutable([
            { name: 'White', age: 20 },
            { name: 'Black', age: 90 },
            { name: 'White', age: 40 },
        ])
        nextState.removeBy(item => item.name === 'White', false)
        expect(nextState.getState()).toEqual([
            { name: 'Black', age: 90 },
        ])
    })

    test('Удаление несуществующего элемента в объекте', () => {
        const nextState = immutable(mockObjectState)
        nextState.removeBy(item => item.name === 'Dark blue')
        expect(nextState.getState()).toEqual({
            'id1': { name: 'White' },
            'id2': { name: 'Black' },
        })
    })
})