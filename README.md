# Rouster.js

<img width="30%" src="rouster.png" alt="Rouster logo" />

## A simple tiny JS frontend router.

> :bulb: When navigate with Rouster, the page url changes but the window does not refresh.

### Add a simple route and navigate to it

```javascript
import Rouster from "./Rouster";

const rouster = new Rouster();

rouster.add("/games", () => {
    console.info(`You called [/games] route`);
});

rouster.navigate('/games');

// console.info => "You called [/games] route" 
```

### Add a simple route, navigate and retrieve the query params

```javascript
import Rouster from "./Rouster";

const rouster = new Rouster();

rouster.add("/games", ({queries}) => {
    console.info(`Display list of games with type [${queries.type}]`);
});

rouster.navigate('/games?type=adventure');

// console.info => "Display list of games with type [adventure]" 
```

### Add a route with named params, navigate and retrieve the params

```javascript
import Rouster from "./Rouster";

const rouster = new Rouster();

rouster.add("/users/:userId/game/:gameId", ({params}) => {
    console.info(`Display details of game with id [${params.gameId}] for user with id [${params.userId}]`);
});

rouster.navigate('/users/123/game/321');

// console.info => "Display details of game with id [321] for user with id [123]" 
```
