const { Ability, AbilityBuilder } = require("@casl/ability");

function getToken(req) {
  let token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;

  return token && token.length ? token : null;
}

const policies = {
  guest(user, { can }) {
    can("read", "DestinasiPopuler");
  },
  user(user, { can }) {
    can("read", "InformasiPopuler");
    can("update", "User", { user_id: user._id });
    can("create", "BerbagiDestinasi", { user_id: user._id });
    can("read", "Ulasan");
    can("create", "Ulasan", { user_id: user._id });
    can("update", "Ulasan", { user_id: user._id });
    can("delete", "Ulasan", { user_id: user._id });
  },
  admin(user, { can }) {
    can("manage", "all");
  },
};

const policyFor = (user) => {
  let builder = new AbilityBuilder();
  if (user && typeof policies[user.role] === "function") {
    policies[user.role](user, builder);
  } else {
    policies["guest"](user, builder);
  }
  return new Ability(builder.rules);
};

module.exports = {
  getToken,
  policyFor,
};
