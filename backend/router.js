module.exports = (app) => {
  const contacts = require('./Toilet.controller.js');

  app.get('/get_toilet_info/', contacts.findAll);
  app.get('/get_toilet_info/:id', contacts.findOne);  
  app.post('/post_toilet_info',contacts.create);
  app.put('/put_toilet_info/:id', contacts.correction);
  app.put('/put_toilet_info/', contacts.correction2);
  app.delete('/delete_toilet_info/:id', contacts.delete);
  app.post('/check_toilet/:id', contacts.check_toilet);
/*
  app.post('/lectureList/',contacts.Listcreate);
  app.get('/lectureList/', contacts.findListAll);
  app.put('/lectureList/:id', contacts.ListUpdata);
  app.get('/lectureList/:id', contacts.findListOne);
  app.delete('/lectureList/:id', contacts.Listdelete);

  const pollution = require('./pollutionController.js')
  app.get('/airkorea/:region',pollution.read);

  app.get('/crawling', contacts.crawling);
  */
}
