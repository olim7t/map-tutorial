// 'More help' sections are hidden by default, reveal them when user clicks on list.
$(document).ready(function () {
    $('a.more_help').click(function () {
        var target_div_id = '#' + $(this).attr('id') + '_contents'
            , target_div = $(target_div_id);

        if (target_div.is(':visible')) $(target_div_id).slideUp();
        else $(target_div_id).slideDown();

        return false;
    });
});