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

describe('Тестирование updateBy', () => {
    test('Обновление элемента в объекте (без with)', () => {
        const nextState = immutable(mockObjectState)
        nextState.updateBy(item => item.name === 'Black', { name: 'Red' })
        expect(nextState.getState()).toEqual({
            'id1': { name: 'White' },
            'id2': { name: 'Red' },
        })
    })

    test('Обновление элемента в массиве (с with)', () => {
        const nextState = immutable(mockArrayState)
        nextState.with('list')
        nextState.updateBy(item => item.name === 'Black', { name: 'Red' })
        expect(nextState.getState()).toEqual({
            list: [
                { name: 'White' },
                { name: 'Red' },
            ]
        })
    })

    test('Обновление первого найденного элемента в массиве', () => {
        const nextState = immutable([
            { name: 'White', age: 20 },
            { name: 'Black', age: 90 },
            { name: 'White', age: 40 },
        ])
        nextState.updateBy(
            item => item.name === 'White',
            { name: 'White', age: 100 }
        )
        expect(nextState.getState()).toEqual([
            { name: 'White', age: 100 },
            { name: 'Black', age: 90 },
            { name: 'White', age: 40 },
        ])
    })

    test('Обновление всех найденных элементов в массиве', () => {
        const nextState = immutable([
            { name: 'White', age: 20 },
            { name: 'Black', age: 90 },
            { name: 'White', age: 40 },
        ])
        nextState.updateBy(
            item => item.name === 'White',
            { name: 'White', age: 100 },
            false
        )
        expect(nextState.getState()).toEqual([
            { name: 'White', age: 100 },
            { name: 'Black', age: 90 },
            { name: 'White', age: 100 },
        ])
    })

    test('Обновление несуществующего элемента в объекте', () => {
        const nextState = immutable(mockObjectState)
        nextState.updateBy(item => item.name === 'Dark blue', { name: 'Red' })
        expect(nextState.getState()).toEqual({
            'id1': { name: 'White' },
            'id2': { name: 'Black' },
        })
    })
})