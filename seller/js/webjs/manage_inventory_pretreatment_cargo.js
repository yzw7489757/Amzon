$(function () {
    var sizeInput1 = $('.sizeInput1').val();
    var sizeInput2 = $('.sizeInput2').val();
    var sizeInput3 = $('.sizeInput3').val();
    var inputweight = $('.inputweight').val();
    var moreSizeInput1 = $('.moreSizeInput1').val();
    var moreSizeInput2 = $('.moreSizeInput2').val();
    var moreSizeInput3 = $('.moreSizeInput3').val();
    var moreSizeweight = $('.moreSizeweight').val();
    var box_goods_num = $('.box_goods_num').val();
    var box_num = $('.box_num').val();
    var shippingMethod; // 配送方式（1 小包裹快递 2 汽运零担）
    var shippingService = 3; // 承运人编号
    var shipmentPacking = "1"; // 如何包装（1 多个箱子  2 所有商品装于一个箱子）
    var provideMode; // 箱内物品信息提供方式（1 使用网页表格 2 上传文件 3 跳过箱子信息并收取手动处理费用 ）
    var goodsBox;
    var moreConfirmTrue = true;
    var boxConfiguration = false;
    var shipmentPackingKey;// 如何包装（1 多个箱子  2 所有商品装于一个箱子）
    var shippingMethodKey;// 配送方式（1 小包裹快递 2 汽运零担）
    var shippingServiceKey;// 承运人编号
    
    if (window.sessionStorage) {
        var planId = sessionStorage.getItem('planId')
        // var planNo = sessionStorage.getItem('planNo')
        var cargoNo = sessionStorage.getItem('cargoNo')
        var planGoodsId = sessionStorage.getItem('planGoodsId')
    }
    if ($('.addInput tr').length <= '2') {
        $('.addInput tr').eq(0).find('.closeBtn').hide();
    }

    function inputValue() {
        goodsNumBox = $('.a_goodsNum').text();
        sizeInput1 = $('.sizeInput1').val();
        sizeInput2 = $('.sizeInput2').val();
        sizeInput3 = $('.sizeInput3').val();
        inputweight = $('.inputweight').val();
        goodsBox = []
        $('.addInput tr').each(function (index, item) {
            if (index == $('.addInput tr').length - 1) return
            let obj = {};
            obj.box_weights = $(this).find('.moreSizeweight').val();
            obj.box_length = $(this).find('.moreSizeInput1').val();
            obj.box_width = $(this).find('.moreSizeInput2').val();
            obj.box_height = $(this).find('.moreSizeInput3').val();
            obj.box_goods_num = $(this).find('.box_goods_num').val();
            obj.box_num = $(this).find('.box_num').val();
            goodsBox.push(obj)
        })
    }
    // 检查并修改商品
    $('.checkupBtn').click(function () {
        $('.checkupBtn').hide();
        $('.hiddengoodsBtn').removeClass('dispplay_none');
        $('.hiddenInfo').show();
    })
    // 隐藏商品
    $('.hiddengoodsBtn').click(function () {
        $('.hiddengoodsBtn').addClass('dispplay_none');
        $('.checkupBtn').show()
        $('.hiddenInfo').hide();
    })

    $('#packing_box_select').bind("change", function () {
        if ($(this).val() == '1') {
            $('.multiple_boxes').show()
            $('.a_box').hide()
        } else if ($(this).val() == '2') {
            provideMode = "-1";
            console.log(provideMode)
            changeFinishBtn();
            $('.multiple_boxes').hide()
            $('.a_box').show()
        }
    })
    // 删除
    $('.deleteBtn').click(function () {
        $(this).parent().parent().remove();
    })
    // 确认
    $('.confirmBtn').click(function () {
        inputValue();
        if (sizeInput1 && sizeInput2 && sizeInput3 && inputweight) {
            strBoxJson = JSON.stringify({
                planNo: planId,
                cargoNo: cargoNo,
                planGoods: [{
                    plan_goods_id: planGoodsId,
                    goodsBox: [{
                        box_weights: inputweight,
                        box_length: sizeInput1,
                        box_width: sizeInput2,
                        box_height: sizeInput3,
                        box_goods_num: goodsNumBox,
                        box_num: '1'
                    }]
                }]
            });
            if (moreConfirmTrue) {
                $.post(baseUrl + '/SetBox', {
                    strBoxJson: strBoxJson
                }, function (res) {
                    console.log(res);
                    if (res.result == '1') {
                        moreConfirmTrue = false;
                        $('.successInfo').show();
                        changeFinishBtn()

                    }
                }, 'json')
            }
        }
    })
    $('.moreConfirmBtn').click(function () {
        inputValue();
        strBoxJson = JSON.stringify({
            planNo: planId,
            cargoNo: cargoNo,
            planGoods: [{
                plan_goods_id: planGoodsId,
                goodsBox: goodsBox
            }]
        });
        if (moreConfirmTrue) {
            $.post(baseUrl + '/SetBox', {
                strBoxJson: strBoxJson
            }, function (res) {
                console.log(res);
                if (res.result == '1') {
                    moreConfirmTrue = false;
                    $('.successInfo').show();
                    changeFinishBtn();
                    $('.moreConfirmBtn').parent().addClass('secondaryLargeButton ');
                    $('.primaryLargeButton').find('span').removeClass('moreConfirmBtn')
                }
            }, 'json')
        }
    })

    // 添加其他箱子配置 删除
    $('.addInput').on("click", '.closeBtn', function () {
        $(this).parent().parent().parent().parent().remove();
        if ($('.addInput tr').length <= '2') {
            $('.addInput tr').eq(0).find('.closeBtn').hide();
        }
    });
    // 完成货件按钮变换颜色
    function changeFinishBtn() {
        if (!moreConfirmTrue && shippingMethod && provideMode) {
            $('.finish').show();
            $('.unfinish').hide();
        }
    }
    // 配送方式（1 小包裹快递 2 汽运零担）
    $('input[name="type"]').change(function () {
        inputValue();
        if ($(this).val() == "1") {
            shippingMethod = 1;
            changeFinishBtn();

        } else {
            shippingMethod = 2;
            changeFinishBtn();
        }
    })
    // 如何包装（1 多个箱子  2 所有商品装于一个箱子）
    $('select[name="select_box"]').change(function () {
        if ($(this).val() == '1') {
            shipmentPacking = 1;
        } else {
            shipmentPacking = 2;
        }
    })
    // 箱内物品信息提供方式（1 使用网页表格 2 上传文件 3 跳过箱子信息并收取手动处理费用 ）
    $('input[name="info"]').change(function () {
        if ($(this).val() == '1') {
            provideMode = 1;
            changeFinishBtn()
        } else if ($(this).val() == '2') {
            provideMode = 2;
            changeFinishBtn()
        } else {
            provideMode = 3;
            changeFinishBtn()
        }
    })

    function Input_blur(target) {
        $(target).blur(function (e) {
            e.preventDefault();
            inputValue();
            changeFinishBtn();
            if ($(target).val() == "") {
                alert('箱子配置为空')
            }
        });
    }
    Input_blur('.moreSizeweight');
    Input_blur('.moreSizeInput1');
    Input_blur('.moreSizeInput2');
    Input_blur('.moreSizeInput3');
    Input_blur('.box_goods_num');
    Input_blur('.box_num');
    // 完成货件
    $('.finishBtn').click(function () {
        inputValue();
        if (!moreConfirmTrue && shippingMethod && provideMode) {
            strGoodsCargo = JSON.stringify({
                planNo: planId,
                cargoNo: cargoNo,
                shippingMethod: shippingMethod,
                shippingService: "3",
                shipmentPacking: shipmentPacking,
                provideMode: provideMode
            });
            $.post(baseUrl + '/SetCargo', {
                strGoodsCargo: strGoodsCargo
            }, function (res) {
                console.log(res);
                if (res.result == '1') {
                    $(location).attr('href', '/seller/manage_inventory_list.html');
                }
            }, 'json')
        } else {
            alert('请选择配送方式 && 箱内物品信息提供方式 && 保存箱子配置')
        }

    })

    // 获取承运人
    $.post(baseUrl + '/GetShippingCarrier', function (res) {
        console.log(res);
        var data = res.carrierInfo
        var add = doT.template($('#addArray').text());
        $('#addTmpl').html(add(data))
        // 承运人编号
        shippingService = $('.select').find('option:selected').attr('data-id');
        $('.select').change(function () {
            shippingService = $('.select').find('option:selected').attr('data-id');
        })
    }, 'json')


    // 获取进度操作数据
    $.post(baseUrl + '/GetSchedule', {
        tag: '5',
        planId: planId,
        cargoNo: cargoNo
    }, function (res) {
        console.log(res);
        $('.cargoName').text(decodeURIComponent(res.cargoName));
        $('.cargoNo').text(decodeURIComponent(res.cargoNo));
        $('.shippingNumber').text(decodeURIComponent(res.shippingNumber));
        $('.name').text(decodeURIComponent(res.adrInfo.name));
        $('.address').text(decodeURIComponent(res.adrInfo.address));
        $('.address2').text(decodeURIComponent(res.adrInfo.address2));
        $('.detailAddress').text(`${decodeURIComponent(res.adrInfo.city)} ${decodeURIComponent(res.adrInfo.province)}`);
        $('.zipcode').text(decodeURIComponent(res.adrInfo.zipcode));
        $('.country').text(decodeURIComponent(res.adrInfo.country));
        $('.goodsNum').text(decodeURIComponent(res.goodsNum));
        $('.createTime').text(res.createTime);
        $('.cargoStatus').text(decodeURIComponent(res.cargoStatus));
        // 配送地址 
        $('.toCity').text(decodeURIComponent(res.toCity));
        $('.toZipcode').text(decodeURIComponent(res.toZipcode));
        $('.toAdr').text(decodeURIComponent(res.toAdr));
    }, 'json')

    // 6.4 查看货件内商品
    $.post(baseUrl + '/GetCargoGoods', {
        planId: cargoNo
    }, function (res) {
        console.log(res)
        var data = res.goodsLable[0];
        // 卖家sku
        $('.sellerId').text(data.sellerId)
        // 商品名称
        $('.goodsName').text(decodeURIComponent(data.goodsName))
        // 商品数量
        $('.goodsNum').val(data.goodsNum);
        // 配送类型：-1 所有 1卖家 2 亚马逊
        if (data.packModel == '-1') {
            $('.shippingMode').text('所有')
        } else if (data.packModel == '1') {
            $('.shippingMode').text('卖家')
        } else if (data.packModel == '2') {
            $('.shippingMode').text('亚马逊')
        }
        // 发货（1是 0否）
        if (data.deliveried == '1') {
            $('.deliveried').text('是')
        } else {
            $('.deliveried').text('0')
        }
        // 货件数量
        $('.goodsNum').text(data.goodsNum)
    }, 'json')

    // 7.1 获取箱子信息
    $.post(baseUrl + '/GetCarGoBox', {
        planId: planId,
        cargoNo: cargoNo
    }, function (res) {
        console.log(res)
        // 商品名称
        $('.goodsNameBox').text(decodeURIComponent(res.goodsName))
        // 商品数量
        $('.goodsNumBox').text(res.goodsNum);
        // 如何包装（1 多个箱子  2 所有商品装于一个箱子）
        shipmentPackingKey = res.shipmentPacking;
        shipmentPacking = shipmentPackingKey
        $('#packing_box_select option[value="'+shipmentPackingKey+'"]').attr('selected', "selected");
        if (shipmentPackingKey == '1') {
            $('.multiple_boxes').show()
            $('.a_box').hide()
        } else if (shipmentPackingKey == '2') {
            provideMode = "-1";
            changeFinishBtn();
            $('.multiple_boxes').hide()
            $('.a_box').show()
        }
        // 小包裹快递
        shippingMethodKey = res.shippingMethod;
        shippingMethod = shippingMethodKey;
        $('input[name="type"][value="'+shippingMethodKey+'"]').attr('checked', "checked");
        // 承运人编号
        shippingServiceKey = res.shippingService;
        shippingService = shippingServiceKey
        $('input[name="type"][value="'+shippingServiceKey+'"]').attr('checked', "checked");
         // 箱内物品信息提供方式
         provideModeKey = res.provideMode;
         provideMode = provideModeKey;
         $('input[name="info"][value="'+provideModeKey+'"]').attr('checked', "checked");
        // 所有商品装于一个箱子
        // 箱子重量
        if (res.boxInfo.length > 0) {
            detail = res.boxInfo;
            let detailTmpl = doT.template($('#showArray').text());
            $('#showTmpl').html(detailTmpl(detail));
            $('.inputweight').val(res.boxInfo[0].weights);
            // 长
            $('.sizeInput1').val(res.boxInfo[0].length);
            // 宽
            $('.sizeInput2').val(res.boxInfo[0].width);
            // 高
            $('.sizeInput3').val(res.boxInfo[0].length);
        }

        // 添加其他箱子配置 添加
        $('.add_configuration').click(function () {
            var html = $(`
        <tr>
            <td class=" width18 align_right">
                <div class="a-spacing-small">
                    <input type="text" class="a-text-right box_goods_num">
                </div>
            </td>
            <td class=" pdLeft45 align_right">
                <div class="a-spacing-small addNumInput">
                    <div class="a-spacing-small">
                        <input type="text" class="a-text-right box_num">
                        <img src="./img/icon_4.png" alt="closeImg" class="pdleft10 closeBtn ">
                    </div>
                </div>
            </td>
            <td class=" width9 align_right">
                <div class="a-spacing-small height21">
                    <span>-</span>
                </div>

            </td>
            <td class="pdLeft45 align_right">
                <div class="a-spacing-small">
                    <input type="text" class="moreSizeweight ">
                </div>
            </td>
            <td class="a-text-right ">
                <div class="a-spacing-small">
                    <input type="text" class="moreSizeInput1 a-text-center ">
                    <img src="./img/close.png" alt="">
                    <input type="text" class="moreSizeInput2 a-text-center ">
                    <img src="./img/close.png" alt="">
                    <input type="text" class="moreSizeInput3 a-text-center ">
                </div>
            </td>
        </tr>
        `)
            const index = $('.addInput tr').length - 2;
            $('.addInput tr').eq(index).after(html);
            if ($('.addInput tr').length > '2') {
                $('.addInput tr').eq(0).find('.closeBtn').show();
            }
        })
    }, 'json')
    // 删除货件
    $('.deleteCargeBtn').click(function () { 
        $.post(baseUrl + '/DeleteCargo', {
            cargoNo: cargoNo,
            planId: planId
        }, function (res) {
            console.log(res);
            if(res.result =="1"){
                alert("删除货件成功")
               // sessionStorage.removeItem('cargoNo')
                if(res.backTag == "1"){
                    $(location).attr('href', '/seller/manage_inventory_checking_cargo.html');
                }else{
                    $(location).attr('href', '/seller/cargo_handling_progress.html');
                }  
            }
        }, 'json')
     })
    // 处理另一个货件
    $('.anotherShipmentBtn').click(function () {
        $(location).attr('href', '/seller/manage_inventory_checking_cargo.html');
    })
    // 返回
    $('.returnBtn').click(function () {
        $(location).attr('href', '/seller/manage_inventory_pretreatment_cargo.html');
    })
})