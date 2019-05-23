function getFields () {
    return {
        firstName: $('#first-name').val(),
        lastName: $('#last-name').val(),
        dateOfBirth: $('#date-of-birth').val(),
        phone: $('#phone').val(),
        bvn: $('#bvn').val()
    }
}

function validateFields (fields) {
    if (!fields.firstName) {
        return false
    }

    if (!fields.lastName) {
        return false
    }

    if (!fields.dateOfBirth) {
        return false
    }

    if (!fields.phone) {
        return false
    }

    if (!fields.bvn) {
        return false
    }

    return true
}

function clickFields () {
    $('[for=first-name]').addClass('active')
    $('[for=last-name]').addClass('active')
    $('[for=date-of-birth]').addClass('active')
    $('[for=phone]').addClass('active')
    $('[for=bvn]').addClass('active')
}

function showSubmitProgress () {
    $('.submit-progress').show()
}

function hideSubmitProgress () {
    $('.submit-progress').hide()
}

function initButtons () {
    $('#validate-btn').click(function () {
        var fields = getFields()
        if (validateFields(fields)) {
            // $('form').submit()
            showSubmitProgress()
            $.post('/customerValidation', fields)
                .done(function (data) {
                    if (data.error) {
                        Materialize.toast('BVN Validation Failed', 2500)
                        $('#error-modal').modal('open')
                        $('.error-table').hide()
                    }
                    else if (data.mismatches && data.mismatches.length) {
                        Materialize.toast('BVN Validation Failed', 2500)
                        $('.error-table').show()

                        let m = data.mismatches
                        Invalid = '<i class="material-icons red-text">cancel</i>'
                        Valid = '<i class="material-icons teal-text">check_circle</i>'
                        
                        $('.fname').text(fields.firstName)
                        $('.fname-s').html(m.includes('First Name') ? Invalid : Valid)

                        $('.lname').text(fields.lastName)
                        $('.lname-s').html(m.includes('Last Name') ? Invalid : Valid)

                        $('.dob').text(fields.dateOfBirth)
                        $('.dob-s').html(m.includes('Date Of Birth') ? Invalid : Valid)

                        $('.phone').text(fields.phone)
                        $('.phone-s').html(m.includes('Phone') ? Invalid : Valid)

                        $('.bvn').text(fields.bvn)
                        $('.bvn-s').html(m.includes('BVN') ? Invalid : Valid)
                    
                        $('#error-modal').modal('open')
                    }
                    else {
                        Materialize.toast('BVN Validation Successful', 2500)

                        let m = data.mismatches
                        Invalid = '<i class="material-icons red-text">cancel</i>'
                        Valid = '<i class="material-icons teal-text">check_circle</i>'
                        
                        $('.fname').text(fields.firstName)
                        $('.fname-s').html(m.includes('First Name') ? Invalid : Valid)

                        $('.lname').text(fields.lastName)
                        $('.lname-s').html(m.includes('Last Name') ? Invalid : Valid)

                        $('.dob').text(fields.dateOfBirth)
                        $('.dob-s').html(m.includes('Date Of Birth') ? Invalid : Valid)

                        $('.phone').text(fields.phone)
                        $('.phone-s').html(m.includes('Phone') ? Invalid : Valid)

                        $('.bvn').text(fields.bvn)
                        $('.bvn-s').html(m.includes('BVN') ? Invalid : Valid)

                        $('#success-modal').modal('open')
                    }
                })
                .fail(function () {
                    Materialize.toast('BVN Validation Failed. Please check your internet connection then try again', 2500)            
                })
                .always(function () {
                    hideSubmitProgress()
                })
        }
        else {
            Materialize.toast('One or more of the input fields weren\'t filled correctly. Check them and try again.', 2500)
        }
    })

    $('#success-continue').click(function () {
        window.location.href = '/customerValidation/complete'
    })

    $('#failure-try-again').click(function () {

    })

    $('#valid-btn').click(function () {
        clickFields()
        $('#first-name').val('Wendy')
        $('#last-name').val('Rhoades')
        $('#date-of-birth').val('1 Jan, 1905')
        $('#phone').val('08012345678')
        $('#bvn').val('12345678901')
    })

    $('#invalid-btn').click(function () {
        clickFields()
        $('#first-name').val('Taylor')
        $('#last-name').val('Mason')
        $('#date-of-birth').val('10 Jan, 1985')
        $('#phone').val('08012345689')
        $('#bvn').val('22345678901')
    })
}

function initDatepicker () {
    $('#date-of-birth').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false, // Close upon selecting a date,
        container: undefined, // ex. 'body' will append picker to body
      });
}

function initModal () {
    $('.modal').modal()
}

function onClickPay () {
    payWithRave()
}

function getRideShareData () {
    return window.rideShareData
}

function payWithRave() {
    var email = getRideShareData().driverName.toLowerCase().replace(' ', '') + '@gmail.com'
    var phone = '09034099655'
    var x = getpaidSetup({
        PBFPubKey: API_publicKey,
        amount: getRideShareData().total,
        customer_email: email,
        customer_phone: phone,
        currency: getRideShareData().currency,
        txref: "rave-123456",
        subaccounts: [
            {
                id: "RS_8C1A8FA1CFE706C26901C090D3D9C4BD"
            }
        ],
        meta: [getRideShareData()],
        onclose: function() {},
        callback: function(response) {
            var txref = response.tx.txRef;
            console.log("This is the response returned after a charge", response);
            if (response.tx.chargeResponseCode == "00" ||
                response.tx.chargeResponseCode == "0") {
                // redirect to a success page
                console.log('Going To:', '/rideSharing/complete/' + JSON.stringify(getRideShareData()))
                window.location.href = '/rideSharing/complete/' + JSON.stringify(getRideShareData())
            } else {
                // redirect to a failure page.
                $('#failure-modal').modal('open')
            }

            x.close(); // use this to close the modal immediately after payment.
        }
    });
}

$(document).ready(function onReady () {
    initButtons()
    initDatepicker()
    initModal()
    hideSubmitProgress()
})

