import immutable from '../src/immutable'
import mockState from './state.mock'

const shortMockState = {
    '1': {
        '2': {
            '3': 1,
            'some': 'one',
        },
        'some': [1, 2, 3],
    }
}

describe('Тестирование set', () => {
    test('Замена элемента по ключу', () => {
        const nextState = immutable(mockState.task1)
        nextState.set('id', 100)
        expect(nextState.getState().id).toEqual(100)
    })

    test('Замена элемента по массиву ключей', () => {
        const nextState = immutable(mockState)
        nextState.set(['task1', 'id'], 100)
        expect(nextState.getState().task1.id).toEqual(100)
    })

    test('Замена по ключу (с использованием with)', () => {
        const nextState = immutable(mockState)
        nextState.with('task1')
        nextState.set('id', 100)
        expect(nextState.getState().task1.id).toEqual(100)
    })

    test('Замена по массиву ключей (с использованием with)', () => {
        const nextState = immutable(mockState)
        nextState.with('task1')
        nextState.set(['_syncActions', 'action1', 'id'], 100)
        expect(nextState.getState().task1._syncActions.action1.id).toEqual(100)
    })

    test('Замена элемента массива', () => {
        const nextState = immutable(mockState)
        nextState.set(['task3', 'permissions', 1], 100)
        expect(nextState.getState().task3.permissions[1]).toEqual(100)
    })

    test('Создание элемента по ключу', () => {
        const nextState = immutable(shortMockState)
        nextState.set('new', 100)
        expect(nextState.getState()).toEqual({
            '1': {
                '2': {
                    '3': 1,
                    'some': 'one',
                },
                'some': [1, 2, 3],
            },
            'new': 100,
        })
    })

    test('Создание элемента по массиву ключей', () => {
        const nextState = immutable(shortMockState)
        nextState.set(['1', 'new'], 100)
        expect(nextState.getState()).toEqual({
            '1': {
                '2': {
                    '3': 1,
                    'some': 'one',
                },
                'some': [1, 2, 3],
                'new': 100,
            }
        })
    })

    test('Проверка на сторонние изменения в объекте', () => {
        const nextState = immutable(shortMockState)
        nextState.set(['1', '2', 'some'], 100)
        expect(nextState.getState()).toEqual({
            '1': {
                '2': {
                    '3': 1,
                    'some': 100,
                },
                'some': [1, 2, 3],
            }
        })
    })
})