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

describe('Тестирование push', () => {
    test('Добавление числа в массив', () => {
        const nextState = immutable(mockState)
        nextState.with(['1', 'some']).push(5)
        expect(nextState.getState()).toEqual({
            '1': {
                '2': {
                    '3': 1,
                    'some': 'one',
                },
                'some': [1, 2, 3, 5],
            }
        })
    })

    test('Добавление объекта в массив', () => {
        const nextState = immutable(mockState)
        nextState.with(['1', 'some']).push({ age: 20 })
        expect(nextState.getState()).toEqual({
            '1': {
                '2': {
                    '3': 1,
                    'some': 'one',
                },
                'some': [1, 2, 3, { age: 20 }],
            }
        })
    })

    test('Добавление элемента в объекте (не должен меняться)', () => {
        const nextState = immutable(mockState)
        nextState.with(['1', '2']).push({ age: 20 })
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