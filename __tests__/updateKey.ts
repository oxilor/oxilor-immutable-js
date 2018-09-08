import immutable from '../src/immutable'

const mockState = {
    '1': { 'id': 1 },
    '2': [ 1, 2, 3 ],
    '3': "something",
    '4': 5,
    '5': null,
}

describe('Тестирование updateKey', () => {
    test('Обновление ключа у элемента, который содержит объект', () => {
        const nextState = immutable(mockState)
        nextState.updateKey('1', 'new')
        expect(nextState.getState()).toEqual({
            'new': { 'id': 1 },
            '2': [ 1, 2, 3 ],
            '3': "something",
            '4': 5,
            '5': null,
        })
    })

    test('Обновление ключа у элемента, который содержит массив', () => {
        const nextState = immutable(mockState)
        nextState.updateKey('2', 'new')
        expect(nextState.getState()).toEqual({
            '1': { 'id': 1 },
            'new': [ 1, 2, 3 ],
            '3': "something",
            '4': 5,
            '5': null,
        })
    })

    test('Обновление ключа у элемента, который содержит строку', () => {
        const nextState = immutable(mockState)
        nextState.updateKey('3', 'new')
        expect(nextState.getState()).toEqual({
            '1': { 'id': 1 },
            '2': [ 1, 2, 3 ],
            'new': "something",
            '4': 5,
            '5': null,
        })
    })

    test('Обновление ключа у элемента, который содержит число', () => {
        const nextState = immutable(mockState)
        nextState.updateKey('4', 'new')
        expect(nextState.getState()).toEqual({
            '1': { 'id': 1 },
            '2': [ 1, 2, 3 ],
            '3': "something",
            'new': 5,
            '5': null,
        })
    })

    test('Обновление ключа у элемента, который содержит null', () => {
        const nextState = immutable(mockState)
        nextState.updateKey('5', 'new')
        expect(nextState.getState()).toEqual({
            '1': { 'id': 1 },
            '2': [ 1, 2, 3 ],
            '3': "something",
            '4': 5,
            'new': null,
        })
    })

    test('Обновление ключа у элемента с использованием with', () => {
        const nextState = immutable(mockState)
        nextState.with('1')
        nextState.updateKey('id', 'new')
        expect(nextState.getState()).toEqual({
            '1': { 'new': 1 },
            '2': [ 1, 2, 3 ],
            '3': "something",
            '4': 5,
            '5': null,
        })
    })

    test('Обновление ключа у несуществующего элемента', () => {
        const nextState = immutable(mockState)
        nextState.updateKey('10', 'new')
        expect(nextState.getState()).toEqual({
            '1': { 'id': 1 },
            '2': [ 1, 2, 3 ],
            '3': "something",
            '4': 5,
            '5': null,
        })
    })
})