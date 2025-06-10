const Contact = require('./Toilet.model.js'); //할일리스트의 스키마 구조가 저장된 자바스크립트 파일

/* 
  ToiletId: {type: Number, require:true},
  Temperature: { type: Number, require: true}, 
  Humidity:{type: Number, require: true},
  State:{type: Boolean, require: true}, 
  Weight:{type: Number, require: true},
  Count:{type:Number, require : true},
*/
exports.create = (req, res) => {
  const contact = new Contact({
    ToiletId: req.body.ToiletId, 
    Temperature: req.body.Temperature,
    Humidity: req.body.Humidity,
    State: req.body.State,
    Weight: req.body.Weight,
    Count : req.body.Count
  });
  
  contact.save() //DB에 저장함
  .then(data => { res.send(data); })
  .catch(err => { 
    res.status(500).send({ message: err.message}); 
  });
};

exports.findAll = (req, res) => {
  Contact.find()
  .then( contacts => { 
	res.send(contacts);
	//console.log(contacts)
	  })
  .catch(err => { 
    res.status(500).send({ message: err.message }); 
  });
};

exports.findOne = (req, res) => {
  Contact.findOne({ToiletId : req.params.id}) 
  .then( contact => {
    if(!contact){ 
      return res.status(404).send({
        message: req.params.id + "에 해당하는 화장실이이 없습니다." }); 
    }
    res.send(contact); //해당하는 할일이 있다면 그대로 send
  }).catch(err => { 
    return res.status(500).send({ message: req.params.id +" 로 검색 중 에러 발생" }); //params가 정확하지 않거나 에러발생시 출력
  });  
};

exports.correction = (req, res) => {
  Contact.findOneAndUpdate( {ToiletId:req.params.id}, 
    { ToiletId: req.body.id, Temperature:req.body.Temperature, Humidity:req.body.Humidity, State:req.body.State, Weight:req.body.Weight, Count:req.body.Count}, 
    {new:true}
  )
  .then(contact => { 
    if(!contact) {
      return res.status(404).send({ message: req.params.id +
        "에 해당하는 화장실이 발견되지 않았습니다." })
    }
    res.send(contact);
  }).catch(err => { 
    return res.status(500).send({ message: err.message });
  });
};

exports.correction2 = (req, res) => {
  Contact.findOneAndUpdate( {ToiletId:req.body.ToiletId}, 
    { ToiletId: req.body.ToiletId, Temperature:req.body.Temperature, Humidity:req.body.Humidity, State:req.body.State, Weight:req.body.Weight, Count:req.body.Count}, 
    {new:true}
  )
  .then(contact => { 
    if(!contact) {
      return res.status(404).send({ message: req.body.ToiletId +
        "에 해당하는 화장실이 발견되지 않았습니다." })
    }
    res.send(contact);
  }).catch(err => { 
    return res.status(500).send({ message: err.message });
  });
};

exports.delete = (req, res) => {
  Contact.findOneAndDelete({ToiletId:req.params.id})
  .then(contact => {
    if(!contact) {
      return res.status(404).send({ message: req.params.id +"에 해당하는 화장실이이 없습니다." })
    }
    res.send({ message: "정상적으로 " + req.params.id + " 화장실이 삭제되었습니다." })
  })
  .catch(err => {
    return res.status(500).send({ message: err.message }); 
  });
};

exports.check_toilet = (req, res) => {
  Contact.findOne({ToiletId : req.params.id}) //주소 params를 통해 들어온 ToiletId를 이용해 원하는 데이터를 찾음
  .then( contact => {
    if(!contact){
      return res.json({ duplicated: false });
      }
      // 찾으면 duplicated: true 리턴
    return res.json({ duplicated: true });
  }).catch(err => { 
    return res.status(500).send({ message: req.params.id +" 로 검색 중 에러 발생" }); //params가 정확하지 않거나 에러발생시 출력
  });  
};