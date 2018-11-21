$(function () {
    inputctr.public.checkLogin();
    var addressId = null;
    var method_id = null;
    var addAddress = false;

    if (window.sessionStorage) {
        // $('.card_name_input').val(sessionStorage.getItem('card_name'))
        method_id = sessionStorage.getItem('method_id')
        if (!method_id)
            return;
        //编辑付款方式（初始化信息）
        $.ajax({
            url: baseUrl + '/GetChargeInfo',
            method: 'post',
            dataType: "json",
            data: {
                method_id: method_id
            },
            success: function (res) {
                console.log(res)
                if (res.result == 1) {
                    var data = res.data;
                    // 卡号
                    $('.card_number').text(data.card_number)
                    // 有效月份
                    $('.valid_through_month_select').val(data.valid_through_month)
                    // 有效年份
                    $('.valid_through_year_select').val(data.valid_through_year)

                    // 持卡人姓名
                    $('.card_holder_name_input').val(decodeURIComponent(data.card_holder_name))
                } else {
                    console.log(decodeURIComponent(res.error))
                }
            },
            error: function (res) {
                console.log(decodeURIComponent(res.error))
            }
        })
    }
    $('.billing_addressBtn').click(function (e) {
        e.preventDefault();
        addAddress = true;
        $('.billing_address').hide()
        $('.send_address').show();
    })
    $('.send_addressBtn').click(function (e) {
        e.preventDefault();
        $('.billing_address').show()
        $('.send_address').hide();
    })


    //初始化账单寄送地址
    $.ajax({
        url: baseUrl + '/GetAddressList',
        method: 'post',
        dataType: "json",
        data: {
            userid: amazon_userid,
            sign: '1'
        },
        success: function (res) {
            console.log(res)
            if (res.result == 1) {
                addressId = res.registered_address_Id
                res.List.forEach(function (item) {
                    item.status = (item.address_id === res.registered_address_Id) ? true : false
                })
                var data = res.List
                var add = doT.template($('#addArray').text());
                $('#addTmpl').html(add(data))
                $('#addTmpl input').each(function (i) {
                    $('#addTmpl input').eq(i).click(function () {
                        addressId = $('input[name=address]:checked').parents('.adds').attr('data-card');
                        console.log(addressId)
                        //console.log($('input[name=address]:checked').parents('.adds').attr('data-card'))
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
        $("div.myWarn").remove();
        $("input").removeClass("activebtn");
        method_id = sessionStorage.getItem('method_id')
        // 街道地址
        var address = $('.address_input').val().trim()
        // 公寓、楼层
        var address2 = $('.address2_input').val().trim()
        // 市/镇
        var city = $('.city_input').val().trim()
        // 州/地区/省
        var province = $('.province_input').val().trim()
        // 国家/地区
        var country = $('.country_select option:selected').text()
        // 邮编
        var zipcode = $('.zipcode_input').val().trim()
        // 手机号
        var phone = $('.phone_input').val().trim()
        // 卡号
        var card_number = $('.card_number').text();
        // 有效月份
        var valid_through_month = $('.valid_through_month_select option:selected').val()
        // 有效年份
        var valid_through_year = $('.valid_through_year_select option:selected').val()
        // 持卡人姓名
        var card_holder_name = $('.card_holder_name_input').val()
        if (addAddress) {
            if (address && city && zipcode && phone) {
                var data = {
                    userid: amazon_userid,
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
                };
                //新增邮寄地址
                $.ajax({
                    url: baseUrl + '/AddAddress',
                    method: 'post',
                    dataType: "json",
                    data: { json: JSON.stringify(data) },
                    success: function (res) {
                        console.log(res)
                        if (res.result == 1) {
                            //window.location.reload()
                            $(location).attr('href', '/seller/payment_method.html')
                        } else {
                            console.log(decodeURIComponent(res.error))
                        }
                    },
                    error: function (res) {
                        console.log(decodeURIComponent(res.error))
                    }
                })
            }
            if (!address) {
                addwarn("address_id", 2, "地址行 1 未填");
                $('.address_input').addClass('activebtn')
            }
            if (!city) {
                addwarn("city_id", 2, "城市未填");
                $('.city_input').addClass('activebtn')
            }
            if (!zipcode) {
                addwarn("zipcode_id", 2, "邮政编码为空");
                $('.zipcode_input').addClass('activebtn')
            }
            if (!phone) {
                addwarn("phone_id", 2, "电话号码字段未填");
                $('.phone_input').addClass('activebtn')
            }

        } else {
            if(!addressId){
                alert('请选择账单寄送地址');
                $(window).scrollTop(400)
                return;
            }
            $.ajax({
                url: baseUrl + '/UpdateChargeInfo',
                dataType: 'json',
                data: {
                    method_id: method_id,
                    userid: amazon_userid,
                    card_number: card_number,
                    valid_through_month: valid_through_month,
                    valid_through_year: valid_through_year,
                    card_holder_name: card_holder_name,
                    billing_address_id: addressId
                },
                method: 'POST',
                success: function (res) {
                    if (res.result == 1) {
                        $(location).attr('href', '/seller/payment_method.html')
                    } else {
                        alert(decodeURIComponent(res.error))
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    })
})