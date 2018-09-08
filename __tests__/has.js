import immutable from '../src/immutable';
const mockState = {
    '1': {
        '2': {
            '3': 1,
            'some': 'one',
        },
        'some': [1, 2, 3],
    }
};
describe('Тестирование has', () => {
    test('Проверка элемента по ключу (без with)', () => {
        const nextState = immutable(mockState);
        expect(nextState.has('1')).toEqual(true);
    });
    test('Проверка элемента по массиву ключей (без with)', () => {
        const nextState = immutable(mockState);
        expect(nextState.has(['1', '2', '3'])).toEqual(true);
    });
    test('Проверка элемента по ключу (с with)', () => {
        const nextState = immutable(mockState);
        nextState.with('1');
        expect(nextState.has('some')).toEqual(true);
    });
    test('Проверка элемента по массиву ключей (с with)', () => {
        const nextState = immutable(mockState);
        nextState.with('1');
        expect(nextState.has(['2', '3'])).toEqual(true);
    });
    test('Проверка несуществующего элемента', () => {
        const nextState = immutable(mockState);
        expect(nextState.has(['1', '2', 'nothing'])).toEqual(false);
    });
});
//# sourceMappingURL=has.js.map