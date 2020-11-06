$(document).ready(function () {
    $('#add_group').on('submit', function (e) {
        e.preventDefault();
        var id = $('#id').val();
        var groupName = $('#groupName').val();

        $ajax({
            url: '/home',
            type: ' POST',
            data: {
                id: id,
                groupName: groupName
            },
            success: function () {
                console.log(groupName);
            }
        })
    })
})