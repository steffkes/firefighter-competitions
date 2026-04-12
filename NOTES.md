time difference, maybe due to timezone?

```javascript
module.exports.formatDate = (date) =>
  new Date(date).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });
```

```
git subtree add \
  --prefix ./data \
  git@github.com:steffkes/firefighter-competitions-data.git main --squash
```

```
git subtree pull \
  --prefix ./data \
  git@github.com:steffkes/firefighter-competitions-data.git main --squash
```
