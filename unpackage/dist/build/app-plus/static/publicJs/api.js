/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.addJSON({
  api: {
    nested: {
      BindUser: {
        fields: {
          req: {
            type: "ReqBindUser",
            id: 1
          },
          rsp: {
            type: "RspBindUser",
            id: 2
          }
        }
      },
      ReqBindUser: {
        fields: {
          token: {
            type: "string",
            id: 1
          },
          json: {
            type: "bool",
            id: 2
          }
        }
      },
      RspBindUser: {
        fields: {
          code: {
            type: "int32",
            id: 1
          },
          msg: {
            type: "string",
            id: 2
          },
          giftlist: {
            rule: "repeated",
            type: "Gift",
            id: 3
          },
          Money: {
            type: "int64",
            id: 4
          }
        }
      },
      Gift: {
        fields: {
          giftid: {
            type: "string",
            id: 1
          },
          name: {
            type: "string",
            id: 2
          },
          image: {
            type: "string",
            id: 3
          },
          svga: {
            type: "string",
            id: 4
          },
          price: {
            type: "int32",
            id: 5
          }
        }
      },
      SendGift: {
        fields: {
          req: {
            type: "ReqSendGift",
            id: 1
          },
          rsp: {
            type: "RspSendGift",
            id: 2
          }
        }
      },
      ReqSendGift: {
        fields: {
          sn: {
            type: "string",
            id: 1
          },
          roomid: {
            type: "int64",
            id: 2
          },
          userids: {
            rule: "repeated",
            type: "int64",
            id: 3
          },
          gift: {
            keyType: "string",
            type: "int32",
            id: 4
          },
          json: {
            type: "bool",
            id: 5
          }
        }
      },
      RspSendGift: {
        fields: {
          code: {
            type: "int32",
            id: 1
          },
          msg: {
            type: "string",
            id: 2
          },
          sn: {
            type: "string",
            id: 3
          }
        }
      }
    }
  }
});

module.exports = $root;
