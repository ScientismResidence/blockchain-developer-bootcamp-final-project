const Censorshield = artifacts.require("Censorshield");

module.exports = function (deployer) {
  deployer.deploy(Censorshield);
};