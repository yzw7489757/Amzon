$(function () {
    inputctr.public.checkLogin();
    var same_fover_address = $('.same_fover_address');
    var add_post_address = $('.add_post_address');
    var Beneficiary_select = $('.Beneficiary_select');
    var full_name = $('.full_name');
    // 初始化数据
    var TaxId;
    var UpdateTax;
    inputctr.public.SellerRegisterLoading();
    $.post(baseUrl + '/GetSellerRegister4', { userid: amazon_userid }, function (data) {
        if (data) {
            inputctr.public.SellerRegisterLoadingRemove();
        }
        if (data.step < '4') {
            inputctr.public.RegisterStep(data.step);
        }
        if (data.result == 1) {
            console.log(data)
                 
            TaxId = data.tax_id;
            UpdateTax = 1;
            full_name.val(decodeURIComponent(data.company_name));
            Beneficiary_select.children('option[value=' + data.owner_type + ']').prop("selected", "selected");
            AddressInit(foverover_post_address, data.List[0]);
            $('.same_fover_address').prop('checked', true);
            if(data.List[0].address_id != data.List[0].address_id){
                AddressInit(add_post_address, data.List2[0]);
            }
            $('.signature_agree').find('input[name="agree"][agreeid=' + data.is_esignature + ']').prop('checked', true);
        } else {
            UpdateTax = 0;
            TaxId = 0;
        }
    }, 'json')
    // 初始化添加地址
    function AddressInit(foverover, arr) {
        foverover.find('select[name="address"]').children('option[value=' + decodeURIComponent(arr.country) + ']').prop("selected", "selected");
        foverover.children('.street_number').val(decodeURIComponent(arr.address));
        foverover.children('.floor').val(decodeURIComponent(arr.address2));
        foverover.children('.city').val(decodeURIComponent(arr.city));
        foverover.children('.province').val(decodeURIComponent(arr.province));
        foverover.children('.post_num').val(arr.zipcode);
    }
    // 添加邮寄地址
    same_fover_address.click(function () {
        if (!$(this).prop('checked')) {
            add_post_address.removeClass('hide')
        } else {
            add_post_address.addClass('hide')
        }
    })
    // 提交永久/邮寄 地址验证
    var foverover_post_address = $('.foverover_post_address');
    var add_post_address = $(".add_post_address");
    // 筛选空值
    function FilterAddress(foverover, flag) {
        var foverover_input = foverover.children('input[type="text"]').filter(function (index) {
            return $(this).val().trim() == '';
        })
        if (foverover_input.length) {
            foverover_input.addClass('red_warning');
            flag = true;
        } else {
            foverover_input.removeClass('red_warning');
            flag = false;
        }
        return flag;
    }
    //AJAX提交永久/邮寄 地址
    var ForveroverAddressId;
    var MailingAddressId;
    function PostAddress(foverover) {
        foverover.children('.tax_address').click(function () {
            var that = $(this);
            var full = FilterAddress(foverover);
            if(!inputctr.public.ispostcode(foverover.find('.post_num').val())){
                foverover.find('.post_num').addClass('red_warning');
                return;
            }else{
                foverover.find('.post_num').removeClass('red_warning');
            }
            if (full) {
                return;
            } else {
                if ($(this).attr('up') == '1') {
                    var AddressType = 6;
                } else {
                    var AddressType = 5;
                }
                inputctr.public.SellerRegisterLoading();
                var address = {
                    userid: amazon_userid,
                    address: foverover.children('.street_number').val(),
                    address2: foverover.children('.floor').val(),
                    city: foverover.children('.city').val(),
                    province: foverover.children('.province').val(),
                    country: foverover.find('select[name="address"]').val(),
                    zipcode: foverover.children('.post_num').val(),
                    type: AddressType
                } 
                $.post(baseUrl + '/AddAddress', { json: JSON.stringify(address) }, function (data) {
                    if (data) {
                        inputctr.public.SellerRegisterLoadingRemove();
                    }
                    if (data.result == 1) {
                        foverover.children('input[type="text"]').prop('disabled', true);
                        foverover.find('select[name="address"]').prop('disabled', true);
                        that.prop('disabled', true).removeClass('red_warning');
                        if (address.type == 6) {
                            ForveroverAddressId = data.addressid
                        }
                        if (address.type == 5) {
                            MailingAddressId = data.addressid
                        }
                    } else {
                        alert(decodeURIComponent(data.error))
                    }
                }, 'json')
            }
        })
    }
    PostAddress(foverover_post_address);
    PostAddress(add_post_address);
    // 提交最终税务信息  
    var submit_survey = $('.submit_survey');
    var name_flag = false;
    var foverover_flag = false;
    var add_flag = false;
    submit_survey.click(function () {
        var same_fover_address = $('.same_fover_address');
        var signature_agree = $('.signature_agree').find('input[name="agree"]:checked');
        // 验证表单是否填写完整
        if (!full_name.val()) {
            full_name.addClass('red_warning');
            name_flag = true;
        } else {
            full_name.removeClass('red_warning');
            name_flag = false;
        }
        FilterAddress(foverover_post_address, foverover_flag);
        if (!foverover_flag) {
            if (!foverover_post_address.children('.tax_address').prop("disabled")) {
                foverover_post_address.children('.tax_address').addClass('red_warning');
                submit_survey.parent().siblings('.address-error').removeClass('hide');
                return;
            } else {
                foverover_post_address.children('.tax_address').removeClass('red_warning');
                submit_survey.parent().siblings('.address-error').addClass('hide');
            }
        }
        if ($('.same_fover_address').is(':checked')) {
            if (name_flag || foverover_flag) {
                submit_survey.parent().siblings('.list-error').removeClass('hide');
                return;
            } else {
                MailingAddressId = ForveroverAddressId;
                submit_survey.parent().siblings('.list-error').addClass('hide');
            }
        } else {
            FilterAddress(add_post_address, add_flag);
            if (name_flag || foverover_flag || add_flag) {
                submit_survey.parent().siblings('.list-error').removeClass('hide');
                return;
            } else {
                submit_survey.parent().siblings('.list-error').addClass('hide');
                if (!add_post_address.children('.tax_address').prop("disabled")) {
                    add_post_address.children('.tax_address').addClass('red_warning');
                    submit_survey.parent().siblings('.address-error').removeClass('hide');
                    return;
                } else {
                    add_post_address.children('.tax_address').removeClass('red_warning');
                    submit_survey.parent().siblings('.address-error').addClass('hide');
                }
            }
        }
        inputctr.public.judgeRecodertask('1006', '提供税务信息开始');
        inputctr.public.SellerRegisterLoading();
        console.log(ForveroverAddressId)
        var Tax_information = {
            userid: amazon_userid,
            receive_income: $('label[for="profit"]').children('input[name="who"]:checked').attr('who'),
            is_usperson: $('label[for="American"]').children('input[name="tax"]:checked').attr('tax'),
            company_name: full_name.val(),
            nationality: $('.nationality').val(),
            owner_type: Beneficiary_select.val(),
            address_id: ForveroverAddressId,
            mailing_address_id: MailingAddressId,
            is_esignature: signature_agree.attr('agreeId'),
            tax_id: TaxId,
            signature: '',
            id: UpdateTax
        }
        console.log(Tax_information)
             
        $.post(baseUrl + '/SellerRegister4', Tax_information, function (data) {
            if (data) {
                inputctr.public.SellerRegisterLoadingRemove();
            }
            if (data.result == 1) {
                inputctr.public.judgeFinishtask('1006', link);

            } else {
                alert(decodeURIComponent(data.error))
            }
        }, 'json')
    })
    function link() {
        window.location.href = 'product_information.html'
    }
})