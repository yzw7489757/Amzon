$(function () {
    var baseUrl = "http://192.168.2.164:8096/QAMZNAPI.asmx";
    var file = null;
    var shopLogoImg = null;
    var imgType = false;
    var toUpload = false;
    // 获取公司徽标
    $.ajax({
        url: baseUrl + '/GetShopLogo',
        method: 'post',
        dataType: "json",
        data: {
            userid: amazon_userid
        },
        success: function (res) {
            if (res) {
                inputctr.public.judgeBegaintask('1107');
            }
            console.log(res);
            $('.logo').attr('src', res.shopLogoImg)
        },
        error: function (res) {
            console.log(decodeURIComponent(res.error))
        }
    })

    function run(input_file, get_data) {
        if (typeof (FileReader) === 'undefined') {
            alert('浏览器不支持fileReader')
            return flase
        }
        try {
            file = input_file.files[0];
            imgType = (/image\/[png,gif]/.test(file.type))
            if (!/image\/\w+/.test(file.type)) {
                alert('请确保文件为图像类型')
                return false
            }
            var render = new FileReader();
            render.onload = function () {
                get_data(this.result)
            }
            render.readAsDataURL(file)
        } catch (e) {
            console.log('图片转换出错', e.toString())
        }
    }

    // 设置公司徽标
    $('input').on('change', function (e) {
        //e.preventDefault();
        inputctr.public.judgeRecodertask('1107', '设计上传卖家logo开始');
        run(this, function (data) {
            if (imgType) {
                $.ajax({
                    url: baseUrl + '/UploadBase64Pic',
                    method: 'post',
                    async: false,
                    dataType: "json",
                    data: {
                        base64_pic: data
                    },
                    success: function (res) {
                        shopLogoImg = decodeURIComponent(res.pic);
                        let image = new Image();
                        image.onload = function () {
                            console.log(image.width, image.height)
                            if(image.width<=120&&image.height<=30){
                                console.log('success')
                                toUpload = true;
                            }else{
                                console.log('faild')
                                toUpload = false;
                            }
                        }
                        image.src = shopLogoImg
                        
                    },
                    error: function (res) {
                        console.log(decodeURIComponent(res.error))
                    }
                })
            } else {
                alert('图片传入类型错误')
            }

        })
    })

    $('button').click(function (e) {
        e.preventDefault()
        if(!toUpload){
            alert('徽标图像必须为 120 像素宽 x 30 像素高。')
            return;
        }
        $.ajax({
            url: baseUrl + '/SetShopLogo',
            method: 'post',
            dataType: "json",
            data: {
                userid: amazon_userid,
                shopLogoImg: shopLogoImg
            },
            success: function (res) {
                console.log(res);
                inputctr.public.judgeFinishtask('1107');
            },
            error: function (res) {
                console.log(decodeURIComponent(res.error))
            }
        })
    })
})