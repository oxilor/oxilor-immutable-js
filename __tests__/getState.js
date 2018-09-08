import immutable from '../src/immutable';
import mockState from './state.mock';
describe('Тестирование getState', () => {
    test('Получение объекта', () => {
        const nextState = immutable(mockState);
        expect(nextState.getState()).toEqual(mockState);
    });
    test('Получение массива', () => {
        const nextState = immutable(mockState.task3.permissions);
        expect(nextState.getState()).toEqual(mockState.task3.permissions);
    });
    test('Получение числа', () => {
        const nextState = immutable(mockState.task1.notifications);
        expect(nextState.getState()).toEqual(mockState.task1.notifications);
    });
    test('Получение строки', () => {
        const nextState = immutable(mockState.task1.id);
        expect(nextState.getState()).toEqual(mockState.task1.id);
    });
    test('Получение null', () => {
        const nextState = immutable(mockState.task1.name);
        expect(nextState.getState()).toEqual(mockState.task1.name);
    });
});
//# sourceMappingURL=getState.js.map