import immutable from '../src/immutable'
import mockState from './state.mock'

describe('Тестирование unwith', () => {
    test('Обращение к объекту после стирания пути', () => {
        const nextState = immutable(mockState)
        nextState.with(['task1', '_syncActions', 'action1'])
        nextState.unwith()
        nextState.with('task1')
        expect(nextState.get('id')).toEqual(mockState.task1.id)
    })
})