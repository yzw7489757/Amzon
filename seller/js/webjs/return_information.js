$(function () {
  var email_format = 0;
  var return_rule = 1;
  var setting_number = 1;
  dropdown_box(".day", "#choose_day");
  dropdown_box(".why", "#choose_why");
  dropdown_box(".why2", "#choose_why2");
  dropdown_box(".type", "#choose_type");
  dropdown_box(".type2", "#choose_type2");
  // tab切换
  $(".headList li").click(function () {
    var index = $(this).index();
    $(".headList li")
      .eq(0)
      .removeClass("activeStyle");
    $(this)
      .addClass("activeStyle")
      .siblings()
      .removeClass("activeStyle");
    $(".mainList>li")
      .eq(index)
      .removeClass("none")
      .siblings()
      .addClass("none");
  });
  // 电子邮件格式
  $(".a-icon-checkbox").hover(
    function () {
      $(".a-icon-checkbox").addClass("checkbox_hover");
    },
    function () {
      $(".a-icon-checkbox").removeClass("checkbox_hover");
    }
  );

  // 默认的自动批准退货申请规则
  function changeImgclick(ulName, classNameHover, classNameClick, input_click) {
    $(`${ulName} li`).click(function (e) {
      e.preventDefault();
      let index = $(this).index();
      // $(ulName).find('li').eq(0).find('i').addClass(classNameClick)
      $(ulName)
        .find(".a-icon-radio")
        .removeClass(classNameClick); //先删除所有的
      $(ulName)
        .find("input")
        .removeClass(input_click); //先删除所有的
      $(ulName)
        .find("li")
        .eq(index)
        .find("i")
        .addClass(classNameClick);
      $(ulName)
        .find("li")
        .eq(index)
        .find("input")
        .addClass(input_click);
    });
    $(`${ulName} li`).hover(function (e) {
      e.preventDefault();
      let index = $(this).index();
      $(ulName)
        .find(".a-icon-radio")
        .removeClass(classNameHover); //先删除所有的
      // $(ulName).find('li').eq(0).find('i').addClass(classNameHover)
      $(ulName)
        .find("li")
        .eq(index)
        .find("i")
        .addClass(classNameHover);
    });
  }
  changeImgclick(
    ".return_request",
    "radio_hover",
    "radio_click",
    "input_click"
  );
  changeImgclick(".RMA", "radio_hover", "radio_click", "input_click");

  // 无法退还商品的退款 添加新规则
  $(".ruleBtn").click(function () {
    $(".old_rule").hide();
    $(".new_rule").show();
  });
  // 退货地址设置 添加新规则
  $('.newRuleBtn').click(function () {
    $('.newRule').hide();
    $('.extra_rule').show();
  })
  // 退货地址设置 添加新规则 取消
  $('.cancelBtn').click(function () {
    $('.newRule').show();
    $('.extra_rule').hide();
  })
  // 设置这些调整 
  $(".setting_adjustment a").click(function (e) {
    e.preventDefault();
    $(".setting_adjustment").hide();
    $(".delete_adjustment").show();
    $(".setting_address").show();
    $('.newRule').show();
    $('.newRuleTip').show()
  });

  // 无法退还商品的退款 删除
  function bindRemove(target) {
    $(`${target} li .removeReason`)
      .off("click")
      .on("click", function () {
        let index = $(this)
          .parents("li")
          .attr("data-index");
        $(`${target} li`)
          .eq(index)
          .remove();
        let ul = $(`${target} li`);
        for (let i = 0; i < ul.length; i++) {
          ul.eq(i).attr("data-index", i);
        }
      });
  }

  // 无法退还商品的退款 点击添加按钮
  function addBtn(btnName, ulName, deleteBtn) {
    $(btnName).click(function () {
      var str = $(ulName)
        .find("p")[0]
        .innerText.replace(/\s+/g, "");
      deteleList(deleteBtn, str);
      bindRemove(deleteBtn);
    });
  }
  addBtn(".return_add", "#choose_why", ".deleteBtn");
  addBtn(".return_add2", "#choose_why2", ".deleteBtn_2");

  function addBtn2(btnName, ulName, deleteBtn) {
    $(btnName).click(function () {
      var str2 = $(ulName)
        .find("input")
        .val()
        .replace(/\s+/g, "");
      deteleList(deleteBtn, str2);
      bindRemove(deleteBtn);
    });
  }
  addBtn2(".addition_add", "#choose_type", ".deleteBtn2");
  addBtn2(".addition_add2", "#choose_type2", ".deleteBtn2_2");
  //电子邮件格式
  $(".emailPreference li").click(function (e) {
    e.preventDefault();
    if (email_format === 0) {
      email_format = 1;
      $(".a-icon-checkbox").addClass("checkbox_click");
    } else {
      email_format = 0;
      $(".a-icon-checkbox").removeClass("checkbox_click");
    }
  });
  // 默认的自动批准退货申请规则
  $(".return_request li").each(function (i) {
    $(".return_request li")
      .eq(i)
      .click(function () {
        if (i >= 1) {
          return_rule = i + 1;
          if (return_rule >= 2) {
            $(".return_day").show();
          } else {
            $(".return_day").hide();
          }
        }
      });
  });
  // 商品退货批准 (RMA) 编号设置
  $(".RMA li").each(function (i) {
    $(".RMA li")
      .eq(i)
      .click(function () {
        if (setting_number === 1) {
          setting_number = 2;
          console.log(setting_number);
        } else {
          setting_number = 1;
        }
      });
  });
  //常规设置（更新常规设置）
  $(".saveBtn").click(function () {
    var return_window = $(".return_window_p").text();
    console.log(email_format)
    if (email_format === 1) {
      $.ajax({
        url: baseUrl + "/UpdateReturnsettings",
        method: "post",
        dataType: "json",
        data: {
          userid: store_id,
          email_format: email_format,
          return_rule: return_rule,
          return_window: return_window,
          setting_number: setting_number
        },
        success: function (res) {
          console.log(res);
          if (res.result == 1) {
            console.log("success!");
          } else {
            $(".error_li").show();
          }
        },
        error: function (res) {
          console.log(decodeURIComponent(res.error));
        }
      });
    }
  });
  // 常规设置(初始化默认退货地址)
  $.ajax({
    url: baseUrl + "/ReturnAddress",
    method: "post",
    dataType: "json",
    data: {
      userid: store_id
    },
    success: function (res) {
      console.log(res);
      if (res.result = 1) {
        var data = res.strAddress
        $('.name').text(decodeURIComponent(data.name))
        $('.address').text(decodeURIComponent(data.address))
        $('.address2').text(decodeURIComponent(data.address2))
        $('.city').text(decodeURIComponent(data.city))
        $('.country').text(decodeURIComponent(data.country))
        $('.email').text(decodeURIComponent(data.email))
        $('.full_name').text(decodeURIComponent(data.full_name))
        $('.phone').text(decodeURIComponent(data.phone))
        $('.province').text(decodeURIComponent(data.province))
        $('.zipcode').text(decodeURIComponent(data.zipcode))
        $('.time').text(time)
        $('.setBtn').hide()
      } else {
        $('.setBtn').show()
      }

    },
    error: function (res) {
      console.log(decodeURIComponent(res.error));
    }
  });

  function utc(){
    var utcArr = new Date().toUTCString().split(' ');
    var time = utcArr[4].split(':')[0]>12? 
              (utcArr[4].split(':')[0]-12+':'+utcArr[4].split(':')[1]+' PM'):
              (utcArr[4].split(':')[0]+':'+utcArr[4].split(':')[1]+' AM')
    return `${utcArr[1]} ${utcArr[2]} ${utcArr[3]} ${time}`
  }
  var time = utc()
  console.log(time)
  


});