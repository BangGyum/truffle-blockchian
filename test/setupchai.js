"use strict";
var chai = require("chai"); //여길로 노드 모듈  폴더에 요청
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
module.exports = chai; //다른 곳에서 import 하면 이 객체를 직접 돌려받음