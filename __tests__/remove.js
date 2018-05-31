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

describe('Тестирование remove', () => {
    test('Удаление элемента по ключу (без with)', () => {
        const nextState = immutable(mockState)
        nextState.remove('1')
        expect(nextState.getState()).toEqual({})
    })

    test('Удаление элемента по массиву ключей (без with)', () => {
        const nextState = immutable(mockState)
        nextState.remove(['1', '2', 'some'])
        expect(nextState.getState()).toEqual({
            '1': {
                '2': {
                    '3': 1,
                },
                'some': [1, 2, 3],
            }
        })
    })

    test('Удаление элемента по ключу (с with)', () => {
        const nextState = immutable(mockState)
        nextState.with('1')
        nextState.remove('some')
        expect(nextState.getState()).toEqual({
            '1': {
                '2': {
                    '3': 1,
                    'some': 'one',
                },
            }
        })
    })

    test('Удаление элемента по массиву ключей (с with)', () => {
        const nextState = immutable(mockState)
        nextState.with('1')
        nextState.remove(['2', '3'])
        expect(nextState.getState()).toEqual({
            '1': {
                '2': {
                    'some': 'one',
                },
                'some': [1, 2, 3],
            }
        })
    })

    test('Удаление элемента массива', () => {
        const nextState = immutable(mockState)
        nextState.remove(['1', 'some', 1])
        expect(nextState.getState()).toEqual({
            '1': {
                '2': {
                    '3': 1,
                    'some': 'one',
                },
                'some': [1, 3],
            }
        })
    })

    test('Удаление несуществующего элемента', () => {
        const nextState = immutable(mockState)
        nextState.remove(['1', 'nothing'])
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