
$(document).ready(function(){
    $('.add-btn').on('click', function(){
        $('#add-input').click();
    });
    $('#add-input').on('change', function(){
        var addInput = $('#add-input');
        if(addInput.val() != ''){
            var formData = new FormData();
            formData.append('upload', addInput[0].files[0]);
           $('#completed').html('Cập nhật avatar thành công!');
            $.ajax({
                url: '/userupload',
                type:'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(){
                    addInput.val('');
                }
            });
        }
       ShowImage(this);
    });
    $('#profile').on('click', function(){
        var username = $('#username').val();
        var fullname = $('#fullname').val();
        var address = $('#address').val();
        var gender = $('#gender').val();
        var aboutme = $('#aboutme').val();
        var upload = $('#add-input').val();
        var image = $('#user-image').val();
        
        var valid = true;
        
        if(upload === ''){
            $('#add-input').val(image);
        }
        
        if(username == '' || fullname == '' || address == '' || gender == '' || aboutme == ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">Bạn cần nhập đầy đủ thông tin....</div>');
        }else{
             upload = $('#add-input').val();
            $('#error').html('');
        }
        
        if(valid == true){
            $.ajax({
                url: '/settings/profile',
                type: 'POST',
                data: {
                    username: username,
                    fullname: fullname,
                    gender: gender,
                    address: address,
                    aboutme: aboutme,
                    upload: upload
                },
                success: function(){
                    setTimeout(function(){
                        window.location.reload();
                    }, 0);
                }
            })
        } else {
            return false;
        }
    });
})

function ShowImage(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function(e){
            $('#show_img').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
