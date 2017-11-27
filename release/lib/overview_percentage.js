jQuery(function ($) {
  var lax = window.lax

  function setForm () {
    var op1 = new window.Option('Select Course', '')
    $('select').append(op1)

    for (var i = 0; i < lax.list.length; i++) {
      var id = lax.list[i]
      var op2 = new window.Option(lax.courses[id], id)
      $('select').append(op2)
    }

    $('form input').val('Show Percentage')
  }

  function setDisplayMsg () {
    var msg = 'Would you like to show the overview percentage?'
    $('form + div').html(msg)
  }

  $('form').submit(function () {
    var url = 'https://mediafiles.uvu.edu/lib/t/extracted.php'
    var msg = 'Pulling data, please wait...'

    $('form input').prop('disabled', true)
    $('form + div').html(msg)

    $.post(url, $(this).serialize(), function (data) {
      var selected = parseInt($('select option:selected').val())
      var msg = 'users visited overview page.'
      var pattern = /overview/i
      var d = {}
      var a = []
      var b = []
      var p

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

        if (!a.some(function (x) { return x === uid })) { a.push(uid) }

        if (pattern.test(match) && !b.some(function (x) { return x === uid })) {
          b.push(uid)
        }
      }

      var n = a.length
      var m = b.length

      if (n === 0) {
        $('form + div').html('No enrollment.')
        return
      }

      if (m === 0) {
        $('form + div').html('No user visited overview page.')
        return
      }

      if (n === m) {
        $('form + div').html('All ' + msg)
        return
      }

      p = m / n * 100
      msg = p.toPrecision(2) + '% ' + msg
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
