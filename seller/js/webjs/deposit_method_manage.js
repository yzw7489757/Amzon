$(function () { 
    // 初始化存款方式
  $.ajax({
    url: baseUrl + '/InitializaDeposit',
    method: 'post',
    dataType: "json",
    data: {
      userid: amazon_userid,
    },
    success: function (res) {
      console.log(res)
      if (res.result == 1) {
        var data = res.data
        $('.bank_location').text(decodeURIComponent(data.bank_location))
        $('.account_name').text(decodeURIComponent(data.account_name))
      }
    }
  })
 })