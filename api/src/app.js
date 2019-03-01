const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const store = require('./store');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.NODE_EXPOSE_PORT || 50050;

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/services', (req, res) => {
  (async () => {
    console.log('/services');
    store.getServiceList().then(
      value => {
        res.json(
          value.Items && value.Items.length > 0
            ? value.Items.filter(item => item.object === 'ENDPOINT').map(
                item => {
                  return {
                    providerId: item.provider,
                    objectType: item.object
                  };
                }
              )
            : []
        );
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
    store.getService(id, 'ENDPOINT').then(
      value => {
        res.json(value.Item);
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
    store.removeService(id, 'ENDPOINT').then(
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

app.get('/container-images/:provider_id', (req, res) => {
  (async () => {
    const id = req.params.provider_id;
    store.getService(id, 'CONTAINER-IMAGES').then(
      value => {
        res.json(value.Item.images);
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
