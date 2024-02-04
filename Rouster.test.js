import {afterEach, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import Rouster from './Rouster';

describe('Router | Navigate', () => {
    let router;

    beforeAll(() => {
        router = new Rouster();
        router.add("/users/:userId/game/:gameId", () => {});
        router.add("/games", () => {});
    });

    it('should navigate to url with params', num => {
        router.navigate('/users/123/game/321');

        expect(location.pathname).toBe("/users/123/game/321");
    });

    it('should navigate to url with queries', num => {
        router.navigate('/games?type=adventure');

        expect(location.pathname + location.search).toBe( "/games?type=adventure");
    });
});

describe('Router | history.pushState', () => {
    let router;
    let originalPushState = history.pushState;

    beforeEach(() => {
        history.pushState = vi.fn();
        router = new Rouster();
        const paramsHandler = () => {
        };
        const queriesHandler = () => {
        };

        router.add("/users/:userId/game/:gameId", paramsHandler);
        router.add("/games", queriesHandler);
    });

    afterEach(() => {
        history.pushState = originalPushState;
    });

    it('should push state for url with params', num => {
        router.navigate('/users/123/game/321');

        const expectedArguments = [null, null, "/users/123/game/321"];
        const [givenArguments] = history.pushState.mock.calls;
        expect(givenArguments).toStrictEqual(expectedArguments);
    });

    it('should push state for url with queries', num => {
        router.navigate('/games?type=adventure');

        const expectedArguments = [null, null, '/games?type=adventure'];
        const [givenArguments] = history.pushState.mock.calls;
        expect(givenArguments).toStrictEqual(expectedArguments);
    });
});

describe('Router | Callbacks', () => {
    let router;
    let paramsHandlerStub;
    let queriesHandlerStub;

    beforeEach(() => {
        router = new Rouster();

        paramsHandlerStub = vi.fn();
        router.add("/users/:userId/game/:gameId", paramsHandlerStub);
        queriesHandlerStub = vi.fn();
        router.add("/games", queriesHandlerStub);
    });

    it('should call the callback with params', num => {
        router.navigate('/users/123/game/321');

        const expectedCallbackArguments = {
            params: {userId: "123", gameId: "321"},
            queries: {},
        };
        const [givenCallbackArguments] = paramsHandlerStub.mock.calls;
        expect(givenCallbackArguments).toStrictEqual([expectedCallbackArguments]);
    });

    it('should call the callback with queries', num => {
        router.navigate('/games?type=adventure');

        const expectedCallbackArguments = {
            params: {},
            queries: {type: "adventure"},
        };
        const [givenCallbackArguments] = queriesHandlerStub.mock.calls;
        expect(givenCallbackArguments).toStrictEqual([expectedCallbackArguments]);
    });
});
