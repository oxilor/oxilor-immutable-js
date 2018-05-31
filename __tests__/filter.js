import immutable from '../src/immutable'

const mockState = {
    'id1': { count: 1, projectId: 'project1' },
    'id2': { count: 3, projectId: 'project2' },
    'id3': { count: 0, projectId: 'project1' },
    'id4': { count: 7, projectId: 'project3' },
}

const mockStateDeep = {
    'id1': {
        0: { count: 0, projectId: 'project1' },
        1: { count: 10, projectId: 'project1' },
        2: { count: 8, projectId: 'project2' },
    },
    'id2': {
        0: { count: 0, projectId: 'project8' },
        1: { count: 11, projectId: 'project1' },
    },
}

describe('Тестирование filter', () => {
    test('Фильтрация объекта по числу (без with)', () => {
        const nextState = immutable(mockState)
        nextState.filter(item => item.count >= 3)
        expect(nextState.getState()).toEqual({
            'id2': { count: 3, projectId: 'project2' },
            'id4': { count: 7, projectId: 'project3' },
        })
    })

    test('Фильтрация объекта по строке (без with)', () => {
        const nextState = immutable(mockState)
        nextState.filter(item => item.projectId === 'project1')
        expect(nextState.getState()).toEqual({
            'id1': { count: 1, projectId: 'project1' },
            'id3': { count: 0, projectId: 'project1' },
        })
    })

    test('Фильтрация объекта с пустым результатом (без with)', () => {
        const nextState = immutable(mockState)
        nextState.filter(item => item.count > 100)
        expect(nextState.getState()).toEqual({})
    })

    test('Фильтрация массива (с with)', () => {
        const nextState = immutable(mockStateDeep)
        nextState.with('id1')
        nextState.filter(item => item.count === 10)
        expect(nextState.getState()).toEqual({
            'id1': {
                1: { count: 10, projectId: 'project1' },
            },
            'id2': {
                0: { count: 0, projectId: 'project8' },
                1: { count: 11, projectId: 'project1' },
            },
        })
    })

    test('Фильтрация по ключу', () => {
        const nextState = immutable(mockState)
        nextState.filter((item, key) => key === 'id2')
        expect(nextState.getState()).toEqual({
            'id2': { count: 3, projectId: 'project2' },
        })
    })
})