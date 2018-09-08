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

describe('Тестирование merge', () => {
    test('Обновление элементов без замены элементов', () => {
        const nextState = immutable(mockState)
        nextState.merge({
            '2': 2,
            '3': 3,
        })
        expect(nextState.getState()).toEqual({
            '1': {
                '2': {
                    '3': 1,
                    'some': 'one',
                },
                'some': [1, 2, 3],
            },
            '2': 2,
            '3': 3,
        })
    })

    test('Обновление элементов с заменой элементов', () => {
        const nextState = immutable(mockState)
        nextState.merge({
            '1': 1,
            '2': 2,
            '3': 3,
        })
        expect(nextState.getState()).toEqual({
            '1': 1,
            '2': 2,
            '3': 3,
        })
    })

    test('Обновление элементов с использованием with', () => {
        const nextState = immutable(mockState)
        nextState.with('1')
        nextState.merge({
            '2': 2,
            '3': 3,
        })
        expect(nextState.getState()).toEqual({
            '1': {
                '2': 2,
                'some': [1, 2, 3],
                '3': 3,
            }
        })
    })
})