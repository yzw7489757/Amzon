window.onload = function () {
    var showText = true;
    var timer = null
    dropdown_box(".countrySelect", "#chooseCountry");
    $('.more_info').hover(
        function () {
            $('.more_info_style').show()
        },
        function () {
            timer = setTimeout(function () {
                $('.more_info_style').hide()
            }, 1000)
            $('.more_info_style').hover(function () {
                clearInterval(timer)
            }, function () {
                $('.more_info_style').hide()
            })
        }
    )
    bubble('.more_info', "您企业的合法注册地址", "more_info_style")
    // 添加新地址
    $('.add_new_address_a').click(function (e) {
        e.preventDefault();
        $('.add_new_address').hide();
        $('.select_existing_address').show();
        $('.Btn').show();
    })
    // 选择现有地址
    $('.select_existing_address_a').click(function (e) {
        e.preventDefault();
        $('.add_new_address').show();
        $('.select_existing_address').hide()
        $('.Btn').show();
    })
    // 取消按钮
    $('.cancelBtn').click(function (e) {
        e.preventDefault();
        $('.address_editing').show();
        $('.select_existing_address').hide();
        $('.add_new_address').hide();
        $('.Btn').hide();
        $.ajax({
            url: baseUrl + '/CancelOperation',
            method: 'post',
            dataType: "json",
            data: {
                userid: store_id,
            },
            success: function (res) {
                console.log(res)
                if (res.result == 1) {
                    var data = res.strAddress
                    console.log(data)
                   $('.fullname_p').text(decodeURIComponent(data.full_name))
                   $('.country_p').text(decodeURIComponent(data.country))
                   $('.address_p').text(decodeURIComponent(data.address))
                   $('.address2_p').text(decodeURIComponent(data.address2))
                   $('.city_p').text(decodeURIComponent(data.city))
                   $('.province_p').text(decodeURIComponent(data.province)) 
                   $('.zipcode_p').text(decodeURIComponent(data.zipcode))
                   $('.phone_p').text(decodeURIComponent(data.phone))
                   $('.email_p').text(decodeURIComponent(data.email))
                } else {
                    console.log(decodeURIComponent(res.error))
                }
            },
            error: function (res) {
                console.log(decodeURIComponent(res.error))
            }
        })
    })
    // 编辑
    $('.address_editing_a').click(function (e) {
        e.preventDefault();
        $('.add_new_address').show();
        $('.Btn').show();
        $('.select_existing_address').hide();
        $('.address_editing').hide();

    })
    // main_text
    $('.main_text_btn').click(function () {
        if (showText) {
            $('.main_text_btn').find('i').removeClass('a-icon-section-expand')
            $('.main_text').hide()
            showText = false;
        } else {
            $('.main_text_btn').find('i').addClass('a-icon-section-expand')
            $('.main_text').show()
            showText = true
        }
    })
    // 正确注册地址(初始化正式注册地址)
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
                        console.log(addressId)
                    })
                })
                console.log('success!')

            } else {
                console.log(decodeURIComponent(res.error))
            }
        },
        error: function (res) {
            console.log(decodeURIComponent(res.error))
        }
    })
    // 更新用户表里注册地址(保存)
    $('.saveBtn').click(function () {
        if ($('.select_existing_address').is(':hidden')) {
            $.ajax({
                url: baseUrl + '/UpdateRegisteredAddress',
                method: 'post',
                dataType: "json",
                data: {
                    userid: store_id,
                    addressId: addressId
                },
                success: function (res) {
                    console.log(res)
                    if (res.result == 1) {
                        console.log('保存成功!')

                    } else {
                        console.log(decodeURIComponent(res.error))
                    }
                },
                error: function (res) {
                    console.log(decodeURIComponent(res.error))
                }
            })
        } else {
            // 添加新地址保存
            // 地址
            var address = $('.address_input').val().trim();
            // 地址行2
            var address2 = $('.address2_input').val().trim();
            // 市/镇
            var city = $('.city_input').val().trim();
            // 州/地区/省;
            var province = $('.province_input').val().trim();
            // 国家/地区
            var country = $('.country_select').text();
            // 邮编
            var zipcode = $('.zipcode_input').val().trim();
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
                    phone: '',
                    type: '1',
                    name: '',
                    email: '',
                    full_name: ''
                },
                success: function (res) {
                    console.log(res)
                    if (res.result == 1) {
                        console.log('新增保存成功')
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







}