jQuery(function ($) {

  function setForm () {
    $('form input').val('Show Overview Users')
  }

  function setDisplayMsg () {
    var msg = 'Would you like to show how many overview users?'
    $('form + div').html(msg)
  }

  $('form').submit(function () {
    var url = 'https://mediafiles.uvu.edu/lib/extracted.php'
    var msg = 'Pulling data, please wait...'

    $('form input').prop('disabled', true)
    $('form + div').html(msg)

    $.post(url, $(this).serialize(), function (data) {
      var selected = parseInt($('select option:selected').val())
      var msg = 'users visited overview page.'
      var pattern = /overview/i
      var d = {}
      var a = []

      d = $.parseJSON(data)
      if (d.length === 0) {
        $('form + div').html('No enrollment.')
        return
      }

      for (var i in d) {
        var courseId = parseInt(d[i]['course_id'])
        var uid = parseInt(d[i]['user_id'])
        var match = d[i]['http_request_clean']

        if (courseId !== selected) { continue }

        if (pattern.test(match) && !a.some(function (x) { return x === uid })) {
          a.push(uid)
        }
      }

      var n = a.length
      if (n === 0) {
        $('form + div').html('No user visited overview page.')
        return
      }

      if (n === 1) {
        $('form + div').html('One user visited overview page.')
        return
      }

      msg = n + ' ' + msg
      $('form + div').html(msg)
    }).fail(function () {
      window.alert('Error: Pullling data!')
    })

    return false
  })

  $('form > select').change(function () {
    $('form input').prop('disabled', false)
    setDisplayMsg()
  })

  function init () {
    setDisplayMsg()
    setForm()
  }

  init()
})
