$(function () {
    var showTitle = true;
    var showAddress = false;
    var addressId = null;
    $('.addNewaddressBtn').click(function (e) {
        e.preventDefault();
        $('.addNewaddress').hide()
        $('.chooseaddress').show()
    })
    $('.chooseaddressBtn').click(function (e) {
        e.preventDefault();
        showAddress = true;
        $('.addNewaddress').show()
        $('.chooseaddress').hide()
    })

     //选择办公地址(初始化办公地址)
     $.ajax({
        url: baseUrl + '/GetAddressList',
        method: 'post',
        dataType: "json",
        data: {
            userid: store_id,
            sign: '1'
        },
        success: function (res) {
            console.log(res)
            if (res.result == 1) {
                var data = res.List
                var add = doT.template($('#addArray').text());
                $('#addTmpl').html(add(data))
                $('#addTmpl input').each(function (i) {
                    $('#addTmpl input').eq(i).click(function () {
                        addressId = $('input[name=address]:checked').parents('.adds').attr('data-card')
                        console.log($('input[name=address]:checked').parents('.adds').attr('data-card'))
                    })
                })
            } else {
                console.log(decodeURIComponent(res.error))
            }
        },
        error: function (res) {
            console.log(decodeURIComponent(res.error))
        }
    })
    
    $('.submitBtn').click(function () { 
         // 街道地址
         var address = $('.address_input').val().trim();
         // 公寓、楼层
         var address2 = $('.address2_input').val().trim();
         // 市/镇
         var city = $('.city_input').val().trim();
         // 州/地区/省;
         var province = $('.province_input').val().trim();
         // 国家/地区
         var country = $('.country_select option:selected').text();
         // 邮编
         var zipcode = $('.zipcode_input').val().trim();
         // 手机号
         var phone = $('.phone_input').val().trim();
        // 提交操作  (更新用户表里的办公地址ID)
        $.ajax({
            url: baseUrl + '/UpdateBusinessAddress',
            method: 'post',
            dataType: "json",
            data: {
                userid: store_id,
                addressId: addressId
            },
            success: function (res) {
                console.log(res)
                if (res.result == 1) {
                    window.location.href="../../company_address.html"
                   
                } else {
                    console.log(decodeURIComponent(res.error))
                }
            },
            error: function (res) {
                console.log(decodeURIComponent(res.error))
            }
        })
        // 邮寄地址
       if(showAddress){
        $.ajax({
            url: baseUrl + '/AddAddressNew',
            method: 'post',
            dataType: "json",
            data: {
                userid: store_id,
                address: address,
                address2: address2,
                city: city,
                province: province,
                country: country,
                zipcode: zipcode,
                phone: phone,
                type: '1',
                name: '',
                email: '',
                full_name: ''
            },
            success: function (res) {
                console.log(res)
                if (res.result == 1) {

                } else {
                    console.log(decodeURIComponent(res.error))
                }
            },
            error: function (res) {
                console.log(decodeURIComponent(res.error))
            }
        })  
       }
     })
})