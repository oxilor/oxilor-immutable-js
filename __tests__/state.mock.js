const state = {
    'task1': {
        id: 'task1',
        projectId: 'project1',
        _syncActions: {
            'action1': {
                id: 'action1',
                request: {
                    parameters: {
                        projectId: 'project1',
                    }
                }
            },
            'action2': {
                id: 'action2',
                request: {
                    parameters: null
                }
            }
        },
        name: null,
        permissions: [],
        notifications: 10,
    },
    'task2': {
        id: 'task2',
        projectId: 'project2',
        _syncActions: {
            'action1': {
                id: 'action1',
                request: {
                    parameters: {
                        projectId: 'project2',
                    }
                }
            }
        },
        name: 'taskName2',
        permissions: ['one'],
        notifications: 20,
    },
    'task3': {
        id: 'task3',
        projectId: 'project1',
        _syncActions: {
            'action1': {
                id: 'action1',
                request: {
                    parameters: {
                        projectId: 'project1',
                    }
                }
            }
        },
        name: 'taskName3',
        permissions: ['one', 'two'],
        notifications: 30,
    },
}

export default state