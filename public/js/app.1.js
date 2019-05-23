var db = firebase.firestore()

function getOptions () {
    var options = []
    $('.option').each(function () {
        var option = $(this).val().trim()
        if (option) {
            options.push(option)
        }
    })
    return options
}

function clearOptions () {
    $('.option').each(function () {
        $(this).val('')
    })
}

function getQuestion () {
    return {
        passage: $('#passage').val().trim(),
        question: $('#question').val().trim(),
        options: getOptions(),
        correctOption: $('#correct-option').val().trim()
    }
}

function clearQuestion () {
    $('#passage').val('')
    $('#question').val('')
    clearOptions()
    $('#correct-option').val('')
}

function hasEnoughOptions (question) {
    var j = 0
    for (var option of question.options) {
        if (option) {
            ++j
        }
    }
    return j >= 2
}

function hasLongEnoughPassage (question) {
    return !question.passage || (question.passage && question.passage.length >= 100)
}

function hasValidAnswer (question) {
    // Check if there's a valid answer
    for (var option of question.options) {
        if (option == question.correctOption) {
            return true
        }
        return false
    }
}

function hasFilledFields (question) {
    if (!question.question) {
        return false
    }
    else if (!question.correctOption) {
        return false
    }
    else if (!hasEnoughOptions(question)) {
        return false
    }
    return true
}

function donwloadJSON (objectData, courseNameSlug) {
    let fileName = courseNameSlug + ".json";
    let contentType = "application/json;charset=utf-8;";

    courseData = {
        time: 30,
        maxQuestions: 50,
        questions: objectData
    }
    
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(courseData)))], { type: contentType });
        navigator.msSaveOrOpenBlob(blob, fileName);
    } 
    else {
        var a = document.createElement('a');
        a.download = fileName;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(courseData));
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

function initAddQuestionBtn () {
    $('#add-question-button').click(function onClick () {
        console.log('Add Question')

        if (window.courseCodeSlug) {
            var question = getQuestion()
            
            if (!hasFilledFields(question)) {
                Materialize.toast('You have not filled all of the compulsory fields. Please check this then try again.', 7000)
                return
            }
            if (!hasValidAnswer(question)) {
                Materialize.toast('None of the options match the correct option you provided. Please check this then try again.', 7000)
                return
            }
            else if (!hasEnoughOptions(question)) {
                Materialize.toast('You did not provide enough options. Please check this then try again.', 7000)
                return
            }
            else if (!hasLongEnoughPassage(question)) {
                Materialize.toast('The passage you provided isn\'t long enough. Please check this then try again.', 7000)
                return
            }

            db.collection(courseCodeSlug).add(
                question
            )
            .then(function(docRef) {
                Materialize.toast('The question was successfully saved', 3000)
                clearQuestion()
            })
            .catch(function(error) {
                Materialize.toast('An error occured while trying to save the question. Please try again.', 7000)
                console.error(error)
            });
        }
        else {
            Materialize.toast('An error occured while trying to access course data. Reload the page and try again.', 7000)
        }
    })
}

function initDeleteQuestionBtn () {
    $('.delete-question-button').click(function onClick () {
        console.log('Delete Question')

        var _id = $(this).attr('_id')
        var courseCodeSlug = $(this).attr('courseCode')
        
        if (window.courseCodeSlug) {
            db.collection(courseCodeSlug)
                .doc(_id)
                .delete()
                .then(function(docRef) {
                    Materialize.toast('The question was successfully deleted', 3000)
                    // Remove question from UI
                    $('.card#' + _id).remove()
                })
                .catch(function(error) {
                    Materialize.toast('An error occured while trying to delete the question. Please try again.', 7000)
                    console.error(error)
                });
        }
        else {
            Materialize.toast('An error occured while trying to access course data. Reload the page and try again.', 7000)
        }
    })
}

function initDownloadQuestionsBtn () {
    $('.download-questions-button').click(function onClick () {
        console.log('Download Questions')

        var courseCodeSlug = $(this).attr('courseCode')

        // donwloadJSON({'name':'Michael Ogezi'}, 'mike')
        db.collection(courseCodeSlug)
            .get()
            .then((querySnapshot) => {
                jsonCollection = []
                querySnapshot.forEach((doc) => {
                    jsonCollection.push(Object.assign({
                        _id: doc.id
                    }, doc.data()))
                });

                donwloadJSON(jsonCollection, courseCodeSlug)
            })
            .catch(function(error) {
                Materialize.toast('An error occured while trying to download ' + courseCode + ' questions. Please try again.', 7000)
                console.error(error)
            });
    })
}

$(document).ready(function onReady () {
    initAddQuestionBtn()
    initDeleteQuestionBtn()
    initDownloadQuestionsBtn()
})