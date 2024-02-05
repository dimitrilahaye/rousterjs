// create a pushstate event in order to trigger routes callback
const PUSH_STATE_EVENT = 'pushstate';
const originalPushState = history.pushState;
history.pushState = function pushState() {
    originalPushState.apply(this, arguments);
    window.dispatchEvent(new Event(PUSH_STATE_EVENT));
};
window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event(PUSH_STATE_EVENT));
});
window.addEventListener("load", (event) => {
    window.dispatchEvent(new Event(PUSH_STATE_EVENT));
});

/**
 * @class Rouster
 * Add a new route path + its callback
 * Navigate to the path url then launch its callback
 */
class Rouster {
    #routes;
    #previousUrl;

    constructor() {
        this.#routes = [];
        this.#previousUrl = "";

        this.#launchUrlChangedListener();
    }

    add(path, callback) {
        const route = this.#buildRoute(path, callback);
        this.#routes.push(route);
    }

    navigate(path) {
        history.pushState(null, null, path);
    }

    #launchUrlChangedListener() {
        window.addEventListener(PUSH_STATE_EVENT, () => {
            if (location.href !== this.#previousUrl) {
                this.#previousUrl = location.href;
                this.#handlePath(location);
            }
        });
    }

    #buildRoute(path, callback) {
        const pattern = new RegExp(`^${path.replace(/:\w+/g, '([a-zA-Z0-9-]+)')}/?$`);
        const keys = Array.from(path.matchAll(/:(\w+)/g), match => match[1]);

        return {
            pattern,
            callback,
            keys: keys,
        };
    }

    #handlePath({pathname, search}) {
        for (const route of this.#routes) {
            const match = pathname.match(route.pattern);

            if (match) {
                this.#navigateTo(search, route, match);
                return;
            }
        }

        console.warn(`Aucune route trouvée pour ${pathname}`);
    }

    #navigateTo(search, route, match) {
        const params = this.#getParams(route, match);
        const queries = this.#getQueries(search);

        route.callback({params, queries});
    }

    #getQueries(search) {
        const queryParams = new URLSearchParams(search);
        const queries = {};
        for (const [key, value] of queryParams.entries()) {
            queries[key] = value;
        }

        return queries;
    }

    #getParams(route, match) {
        return route.keys.reduce((acc, key, index) => {
            acc[key] = match[index + 1];
            return acc;
        }, {});
    }
}

export default Rouster;
