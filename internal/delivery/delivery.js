import express from 'express';

class App {
  constructor(billboardsService) {
    this.app = express();
    this.billboardsService = billboardsService;
  }

  run(appConf) {
    this.app.get('/api/v1/ping', (req, res) => {
      res.status(200).json('Pong!');
    });
  
    this.app.listen(appConf.appPort, appConf.address, () => {
      console.log(`Server is running on http://${appConf.address}:${appConf.appPort}`);
    });
  }  
}

export default App;