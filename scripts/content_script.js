
(function ($) {
    const form = $('<form/>');
    form.attr('enctype', 'multipart/form-data');
    const fileInput = $('<input>').attr({
        'type': 'file',
        'id': 'my-file-input',
        'name': 'my-file-input',
    });
    const submitButton = $('<button>').attr('type', 'submit').text('Mark Attendance');


    const div = $('<div>').css({
        'display':'flex',
        'gap':'4px',
        'flex-direction':'column',
        'padding':'16px',
        'background-color':'#f0f0f0',
    })


    submitButton.css({
        'background-color':'#fa510f',
        'padding':'8px 16px',
        'border-radius':'4px',
        'border':'none',
        'color':'white'
    })


    form.css({
        'background-color':'#f0f0f0',
        'padding':'20px 24px',
        'margin':'18px 0px 0px 0px',
        'display':'flex',
        'gap':"8px"
    })

    fileInput.css({
        'color':'#101f3c'
    })

    form.append(fileInput)
    form.append(submitButton)


    // add an event listener to the submit button
    form.on('submit', function (e) {
        e.preventDefault()
        const fileInput = $('#my-file-input')[0];
        var file = fileInput.files[0];




        if (file) {
            // Read the file contents

            const reader = new FileReader();
            reader.readAsText(file);


            // handle the file contents
            reader.onload = function (event) {
                event.preventDefault()
                var csv = event.target.result;
                var rows = csv.split('\n');
                const studentList = document.getElementById('student-list');

                const csList = []
                const markedList = []

                // loop over the CSV rows
                for (var i = 1; i < rows.length; i++) {
                    var row = rows[i].split(',');
                    csList.push((row[0].concat(' ').concat(row[1])).toLowerCase())
                    // console.log('Row ' + i + ': ' + row.join(', '));
                    // Get the list element

                    // const studentListFrame = document.getElementById('tool_content');

                    // // Get the contentDocument object of the iframe
                    // const studentListDoc = studentListFrame.contentDocument || studentListFrame.contentWindow.document;
                    // Get all the student name elements

                }

                const studentNames = studentList.querySelectorAll('.student-name');

                // Loop through each student name
                for (let i = 0; i < studentNames.length; i++) {
                    const name = studentNames[i];

                    // Get the concatenated name value


                    // Check if the name is on the list 
                    if (csList.includes(name.textContent.trim().toLowerCase())) {

                       markedList.push(name.textContent.trim().toLowerCase())

                        // Highlight the parent <li> element
                        const listItem = studentNames[i];
                        listItem.style.backgroundColor = 'yellow';
                        listItem.click()
                    }
                }
                
                // Names in the csv attendance list and not found on canvas 
                // might require manual marking 

                const notMarked = csList.filter(n => !markedList.includes(n))

                // alert(studentNames.length )
                // alert(csList.length)

                // console.log(JSON.stringify(notMarked))

                div.empty();


                div.append($('<p>').text('Not Found (Manual Marking)').css({
                    "font-size":'20px',
                    'font-weight':'Bold',
                    'color':'#101f3'
                }))



                for(let i = 0;i < notMarked.length;i++){
                  notfound =  $('<p>').text(notMarked[i]).css({
                    'color':'#101f3c',
                    'font-size':'16px'
                  })

                  div.append(notfound)
                  

                  
                }

                $('body').append(div)


            };
        }else{
            alert("please select a file to Continue")
        }
    })


    $('body').append(form);

    // get the selected CSV file

})(jQuery);;

