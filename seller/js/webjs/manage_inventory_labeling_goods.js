$(function () {
    var baseUrl = 'http://192.168.2.164:8096/QAMZNAPI.asmx';
    var planGoodsId;
    var labelQuantity = $('.labelQuantity').val().trim();
    var strGoodsLableJson;
    var printlabel = false;
    if (window.sessionStorage) {
        var planId = sessionStorage.getItem('planId')
    }
    $('#select').change(function () {
        $("select[name=childSelect]").find('option').attr('selected', false)
        if ($(this).val() == '适用于全部') {
            $("select[name=childSelect]").find('option[value="适用于全部"]').attr('selected', true)
        }
    })
    $('select[name="childSelect"]').change(function () {
        if ($(this).val() == '卖家') {
            labelOwner = 1;

        } else if ($(this).val() == '亚马逊') {
            labelOwner = 2;

        } else {
            labelOwner = 0;

        }
    })
    // 商品信息初始化
    $.post(baseUrl + '/GetLableInfo', {
        planId: planId
    }, function (res) {
        console.log(res)
        var data = res.goodsLable[0];
        // 卖家sku
        $('.sellerSku').text(data.sellerId)
        // 商品名称
        $('.goodsName').text(decodeURIComponent(data.goodsName))
        // 配送类型：-1 所有 1卖家 2 亚马逊
        if (data.packModel == '-1') {
            $('.shippingMode').text('所有')
            labelOwner = 0;
        } else if (data.packModel == '1') {
            $('.shippingMode').text('卖家')
            labelOwner = 1;
        } else if (data.packModel == '2') {
            $('.shippingMode').text('亚马逊')
            labelOwner = 2;
        }
        // 贴标方（1 卖家 2 亚马逊）
        if (data.labelOwner == '1') {
            labelOwner = 1;
            $("select[name=childSelect]").find('option[value="卖家"]').attr('selected', true)
        } else if (data.labelOwner == '2') {
            labelOwner = 2;
            $("select[name=childSelect]").find('option[value="亚马逊"]').attr('selected', true)
        } else {
            labelOwner = 0;
            $("select[name=childSelect]").find('option[value="适用于全部"]').attr('selected', true)
        }
        // 要打印的标签数量
        $('.labelQuantity').val(data.labelQuantity)
        $('.labelQuantitySpan').text(data.labelQuantity)
        // 商品数量
        $('.goodsNum').text(data.goodsNum)
        
        if (window.sessionStorage) {
            planGoodsId = sessionStorage.getItem('planGoodsId', data.planGoodsId)
        }
    }, 'json')
    // 标签总数
    $('.labelQuantity').change(function () {
        $('.labelQuantitySpan').text($(this).val())
    })
    // 为此页面打印标签按钮
    $('.printlabelBtn').click(function () {
        printlabel = true;
    })
    // 删除
    $('.deleteBtn').click(function () {
        $(this).parent().parent().remove();
    })
    // 继续
    $('.goBtn').click(function () {
        
        labelQuantity = $('.labelQuantity').val().trim();
        strGoodsLableJson = JSON.stringify({
            goodsLable: [{
                planGoodsId: planGoodsId,
                labelOwner: labelOwner,
                labelQuantity: labelQuantity
            }]
        });
        $.post(baseUrl + '/SetGoodsLable', {
            strGoodsLableJson: strGoodsLableJson
        }, function (res) {
            console.log(res);
            if (res.result == '1') {
                console.log('success!')
                $(location).attr('href', '/seller/manage_inventory_checking_cargo.html');
            }
        }, 'json')

    })
    // 返回
    $('.returnBtn').click(function () {
        $(location).attr('href', '/seller/manage_inventory_preprocessed_goods.html');
    })
})