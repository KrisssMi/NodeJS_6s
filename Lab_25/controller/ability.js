exports.ability = (req, res) => {
  // получение прав доступа
  res.status(200).send(req.rules); // req.rules - это объект, который содержит права доступа пользователя
};
