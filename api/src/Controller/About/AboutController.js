const { getNumberUserService } = require('../../Model/user-services');
const { getNumberUserWidget } = require('../../Model/user-widgets');
const { getNumberUser } = require('../../Model/users');
const about = require('./../../../config/about.json');

//#region Response

function send500(res) {
  res.status(500).send('Internal server error');
}

function sendAbout(res, about) {
  res.json(about);
}

//#endregion

//#region Controller

const getAbout = async (req, res) => {
  try {
    const users = await getNumberUser();
    about.utilisateurs = users.nb;
    for (let index = 0; index < about.services.length; index++) {
      const users = await getNumberUserService(about.services[index].name);
      about.services[index].utilisateurs = users.nb;
    }
    for (let index = 0; index < about.widgets.length; index++) {
      const users = await getNumberUserWidget(about.widgets[index].name);
      about.widgets[index].utilisateurs = users.nb;
    }
    const now = new Date();
    about.date = now.toISOString();
    about.lancement = req.started_at;
    sendAbout(res, about)
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

//#endregion

module.exports = {
  getAbout
}
