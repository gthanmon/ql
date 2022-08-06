const Template = require("../../template");

class Main extends Template {
  constructor() {
    super();
    this["title"] = '京东京豆续期';
    this["cron"] = "10 0 * * *";
    this["task"] = 'local';
    this["import"] = ["jdUrl"];
    this["turn"] = 2;
  }

  async ["main"](_0x447bf2) {
    let _0x33c512 = _0x447bf2["cookie"];

    if (this["turnCount"] == 0) {
      let _0x44b809 = await this["curl"](this["modules"]["jdUrl"]["app"]('jingBeanDetail', {}, 'post', _0x33c512));

      let _0xb4991e = 0;

      if (!this["haskey"](_0x44b809, 'others')) {
        let _0x47371d = await this["curl"]({
          'url': "https://wq.jd.com/activep3/singjd/queryexpirejingdou?_=1637926089761&g_login_type=0&callback=jsonpCBKC&g_tk=353098972&g_ty=ls&sceneval=2&g_login_type=1",
          'cookie': _0x33c512
        });

        for (let _0x28cc42 of this["haskey"](_0x47371d, "expirejingdou")) {
          _0xb4991e += _0x28cc42["expireamount"];
        }
      } else {
        let _0x138066 = this["match"](/有(\d+)个/, this["haskey"](_0x44b809, "others.jingBeanExpire.title"));

        _0xb4991e = parseInt(_0x138066) || 0;
      }

      if (_0xb4991e) {
        console["log"]("当前有即将过期京豆:", _0xb4991e);

        if (_0xb4991e > 5000) {
          _0xb4991e = 5000;
        } else {
          _0xb4991e < 100 && _0xb4991e > 19 && (_0xb4991e = 100);
        }
      }

      if (_0xb4991e) {
        console["log"]("即将兑换京豆: " + _0xb4991e);

        let _0x338fcc = this["uuid"](7) + '-' + this["uuid"](4) + '-' + this["uuid"](4) + '-' + this["uuid"](4) + '-' + this["uuid"](12);
      } else {
        console["log"]("没有过期京豆");
      }

      let _0x310e25 = await this["curl"]({
        'url': "https://lop-proxy.jd.com/JingIntegralApi/userAccount",
        'json': [{
          'pin': "$cooMrdGatewayUid$"
        }],
        'cookie': _0x33c512,
        'headers': {
          'lop-dn': 'jingcai.jd.com',
          'appparams': "{\"appid\":158,\"ticket_type\":\"m\"}"
        }
      });

      let _0x27c0be = this["haskey"](_0x310e25, 'content.integral');

      _0x27c0be > 5000 && (_0x27c0be = 5000);
      console["log"]("当前可用积分:", _0x27c0be);
      this["dict"][_0x447bf2["user"]] = {
        'intergral': _0x27c0be
      };
    } else {
      let _0x47e403 = this["uuid"](7) + '-' + this["uuid"](4) + '-' + this["uuid"](4) + '-' + this["uuid"](4) + '-' + this["uuid"](12);

      if (this["dict"][_0x447bf2["user"]] && this["dict"][_0x447bf2["user"]]["intergral"]) {
        let _0xa606d4 = this["dict"][_0x447bf2["user"]]["intergral"];
        console["log"]("当前可用积分:", _0xa606d4);

        if (_0xa606d4 && _0xa606d4 > 99) {
          for (let _0x2acc28 of [0, 1]) {
            await this["wait"](4000);

            let _0x18ab77 = await this["curl"]({
              'url': "https://lop-proxy.jd.com/JingIntegralApi/transfer",
              'json': [{
                'pin': "$cooMrdGatewayUid$",
                'businessNo': _0x47e403,
                'type': 2,
                'transferNumber': _0xa606d4,
                'title': "物流积分兑换京豆"
              }],
              'cookie': _0x33c512,
              'headers': {
                'lop-dn': "jingcai.jd.com",
                'appparams': "{\"appid\":158,\"ticket_type\":\"m\"}"
              }
            });

            console["log"](_0x18ab77);

            if (this["haskey"](_0x18ab77, "msg", "集团间单日兑换数量已达上限")) {
              console["log"]("没有京豆了,跳出兑换");
              this["jump"] = 1;
              break;
            }

            if (this["haskey"](_0x18ab77, 'data') && this["haskey"](_0x18ab77, "success")) {
              this["print"]("兑换京豆: " + _0xa606d4, _0x447bf2["user"]);
              break;
            }
          }
        }
      } else {
        console["log"]('没有可兑换积分');
      }
    }
  }

}

module["exports"] = Main;