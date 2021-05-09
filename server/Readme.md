# Journi challenge

## How to run

- Docker is recommended.
- `sudo docker-compose -f docker-compose.yml up` is development environment
- `sudo docker-compose -f docker-compose.prod.yml up` is production environment

- You can also build directly.

- When server running, you will see a log similar of this

```
journi_1  | 	🛡️ ###########################🛡️
journi_1  |
journi_1  | 	 Server is listening to:
journi_1  |
journi_1  | 	 🚀 http://172.18.0.2:5000
journi_1  |
journi_1  | 	 🔨 Build ver: 1.0.0
journi_1  |
journi_1  | 	 📳 Production mode
journi_1  |
journi_1  | 	🛡️ ###########################🛡️
```

- Please run client separately.

### Some points to mention

**Disadvantage**

- I spent time finding the "Missing" item `Brazzaville (Congo)` which finally was not among the countries in json file first place.
- No unit test.
- Front-end not bounded (I just need to build endpoint that serve the build files from react and put it in public) (Time limitation)

**Advantage**

- The application using client IP by default and fallback to user location when not exists
- The app is fast due to the redis strategy used here. (Caching countries for the same)
- Docker container as hosting environment.
