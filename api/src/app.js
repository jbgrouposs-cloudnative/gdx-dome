const express = require('express');
const cors = require('cors');
const store = require('./store');

const app = express();
app.use(cors());

const port = process.env.NODE_EXPOSE_PORT || 50050;

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/services', (req, res) => {
  (async () => {
    console.log('/services');
    store.getServiceList().then(
      value => {
        res.json(value);
      },
      reason => {
        res.json(reason);
      }
    );
  })().catch(reason => {
    res.json(reason);
  });
});

app.get('/services/:provider_id', (req, res) => {
  (async () => {
    const id = req.params.provider_id;
    console.log(id);
    store.getService(id).then(
      value => {
        res.json(value);
      },
      reason => {
        res.json(reason);
      }
    );
  })().catch(reason => {
    res.json(reason);
  });
});

app.post('/services', (req, res) => {
  (async () => {
    const service = req.body;
    console.log('/services');
    console.log(service);
    store.saveService(service).then(
      value => {
        res.json(value);
      },
      reason => {
        res.json(reason);
      }
    );
  })().catch(reason => {
    res.json(reason);
  });
});

app.put('/services/:provider_id', (req, res) => {
  (async () => {
    const service = req.body;
    console.log('/services/' + req.params.provider_id);
    console.log(service);
    store.saveService(service).then(
      value => {
        res.json(value);
      },
      reason => {
        res.json(reason);
      }
    );
  })().catch(reason => {
    res.json(reason);
  });
});

app.delete('/services/:provider_id', (req, res) => {
  (async () => {
    const id = req.params.provider_id;
    store.removeService(id).then(
      value => {
        res.json(value);
      },
      reason => {
        res.json(reason);
      }
    );
  })().catch(reason => {
    res.json(reason);
  });
});

app.listen(port, () => console.log('Example app listening on port ' + port));
