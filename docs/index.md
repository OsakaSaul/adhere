The Tavern Discord Bot
===

## _This Doc is a Work in Progress_

---

## Common Production Tasks

Starting/Restart the Bot
```shell
cd /srv/adhere
docker compose up -d
```

Watch Bot Logs
```shell
cd /srv/adhere
docker compose logs -f bot
```

Deploy Update
```shell
cd /srv/adhere
git pull
docker compose build
docker compose up -d
```

---

## Table of Contents

- [Discord Application](discord-app.md)
- [Local Development](local-dev.md)
- [Running on Linode](linode.md)





---

Old README.md available at [old-readme.md](old-readme.md)