import immutable from '../src/immutable'
import mockState from './state.mock'

describe('Тестирование with', () => {
    test('Прямое обращение к объекту', () => {
        const nextState = immutable(mockState)
        nextState.with('task1')
        expect(nextState.get('projectId')).toEqual(mockState.task1.projectId)
    })

    test('Обращение к объекту по ключу (без сохранения пред. пути)', () => {
        const nextState = immutable(mockState)
        nextState.with('task1')
        nextState.with('task2')
        expect(nextState.get('projectId')).toEqual(mockState.task2.projectId)
    })

    test('Обращение к объекту по ключу (с сохранением пред. пути)', () => {
        const nextState = immutable(mockState)
        nextState.with('task1')
        nextState.with('_syncActions', true)
        nextState.with('action1', true)
        expect(nextState.get('id')).toEqual(mockState.task1._syncActions.action1.id)
    })

    test('Обращение к объекту по массиву ключей (без сохранения пред. пути)', () => {
        const nextState = immutable(mockState)
        nextState.with(['task1', '_syncActions', 'action2'])
        nextState.with(['task2', '_syncActions', 'action1'])
        expect(nextState.get('id')).toEqual(mockState.task2._syncActions.action1.id)
    })

    test('Обращение к объекту по массиву ключей (с сохранением пред. пути)', () => {
        const nextState = immutable(mockState)
        nextState.with(['task1', '_syncActions'])
        nextState.with(['action1', 'request'], true)
        nextState.with(['parameters'], true)
        expect(nextState.get('projectId')).toEqual(mockState.task1._syncActions.action1.request.parameters.projectId)
    })
})