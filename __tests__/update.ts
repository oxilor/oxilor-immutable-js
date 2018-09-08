import immutable from '../src/immutable'

const mockState = {
    '1': {
        '2': {
            '3': 1,
            'some': 'one',
        },
        'some': [1, 2, 3],
    }
}

describe('Тестирование update', () => {
    test('Обновление объекта (без with)', () => {
        const nextState = immutable(mockState)
        nextState.update('1', { age: 20 })
        expect(nextState.getState()).toEqual({
            '1': { age: 20 }
        })
    })

    test('Обновление массива (c with)', () => {
        const nextState = immutable(mockState)
        nextState.with(['1', 'some']).update(0, 10)
        expect(nextState.getState()).toEqual({
            '1': {
                '2': {
                    '3': 1,
                    'some': 'one',
                },
                'some': [10, 2, 3],
            }
        })
    })

    test('Обновление несуществующего элемента', () => {
        const nextState = immutable(mockState)
        nextState.with('1').update('nothing', { age: 20 })
        expect(nextState.getState()).toEqual({
            '1': {
                '2': {
                    '3': 1,
                    'some': 'one',
                },
                'some': [1, 2, 3],
            }
        })
    })
})