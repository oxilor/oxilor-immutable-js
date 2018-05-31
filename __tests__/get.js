import immutable from '../src/immutable'
import mockState from './state.mock'

describe('Тестирование get', () => {
    test('Обращение к элементу по ключу', () => {
        const nextState = immutable(mockState)
        expect(nextState.get('task1')).toEqual(mockState.task1)
    })

    test('Обращение к элементу по массиву ключей', () => {
        const nextState = immutable(mockState)
        expect(nextState.get(['task1', 'id'])).toEqual(mockState.task1.id)
    })

    test('Обращение к элементу по ключу (с использованием with)', () => {
        const nextState = immutable(mockState)
        expect(nextState.with('task1').get('id')).toEqual(mockState.task1.id)
    })

    test('Обращение к элементу без передачи параметров (с использованием with)', () => {
        const nextState = immutable(mockState)
        expect(nextState.with(['task1', 'id']).get()).toEqual(mockState.task1.id)
    })

    test('Обращение к элементу по массиву ключей (с использованием with)', () => {
        const nextState = immutable(mockState)
        expect(nextState.with(['task1', '_syncActions'])
            .get(['action1', 'id'])).toEqual(mockState.task1._syncActions.action1.id)
    })

    test('Обращение к элементу массива', () => {
        const nextState = immutable(mockState.task3.permissions)
        expect(nextState.get(1)).toEqual(mockState.task3.permissions[1])
    })

    test('Обращение к несуществующему элементу', () => {
        const nextState = immutable(mockState.task3.permissions)
        expect(nextState.get('id')).toEqual(undefined)
    })

    test('Обращение к элементу массива', () => {
        const nextState = immutable(mockState.task3.permissions)
        expect(nextState.get(10)).toEqual(undefined)
    })
})