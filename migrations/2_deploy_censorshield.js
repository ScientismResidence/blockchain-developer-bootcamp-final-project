const Strings = artifacts.require("Strings");
const Censorshield = artifacts.require("Censorshield");

module.exports = function (deployer) {
  deployer.deploy(Strings);
  deployer.link(Strings, [Censorshield]);
  deployer.deploy(Censorshield);
};