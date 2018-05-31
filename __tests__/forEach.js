import immutable from '../src/immutable'
import mockState from './state.mock'

const shortMockState = {
    'task1': { id: 1 },
    'task2': { id: 2 },
    'task3': { id: 3 },
}

const mockArrayState = [
    { id: 1, name: 'name 1' },
    { id: 2, name: 'name 2' },
    { id: 3, name: 'name 3' },
]

describe('Тестирование forEach', () => {
    test('Замена ID у всех элементов', () => {
        const nextState = immutable(shortMockState)
        nextState.forEach(item => {
            item.set('id', 'new')
        })
        expect(nextState.getState()).toEqual({
            'task1': { id: 'new' },
            'task2': { id: 'new' },
            'task3': { id: 'new' },
        })
    })

    test('Замена свойства во всех элементах в массиве', () => {
        const nextState = immutable(mockArrayState)
        nextState.forEach(item => {
            item.set('name', 'some name')
        })
        expect(nextState.getState()).toEqual([
            { id: 1, name: 'some name' },
            { id: 2, name: 'some name' },
            { id: 3, name: 'some name' },
        ])
    })

    test('Замена projectId, используя вложенный forEach', () => {
        const nextState = immutable(mockState)
        nextState.forEach(item => {
            if (item.get('projectId') === 'project1') {
                // Обновляем projectId
                item.set('projectId', 'newProject')

                // Обновляем request.parameters.projectId в _syncActions
                item.with('_syncActions').forEach(syncAction => {
                    if (syncAction.has(['request', 'parameters', 'projectId']) &&
                        syncAction.get(['request', 'parameters', 'projectId']) === 'project1')
                    {
                        syncAction.set(['request', 'parameters', 'projectId'], 'newProject')
                    }
                })
            }
        })
        expect(nextState.getState().task1.projectId).toEqual('newProject')
        expect(nextState.getState().task2.projectId).toEqual('project2')
        expect(nextState.getState().task3.projectId).toEqual('newProject')
        expect(nextState.getState().task1._syncActions.action1.request.parameters.projectId).toEqual('newProject')
        expect(nextState.getState().task1._syncActions.action2.request.parameters).toEqual(null)
        expect(nextState.getState().task2._syncActions.action1.request.parameters.projectId).toEqual('project2')
        expect(nextState.getState().task3._syncActions.action1.request.parameters.projectId).toEqual('newProject')
    })
})