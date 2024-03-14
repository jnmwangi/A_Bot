async function highlightAtRisk() {
    const table = document.querySelector("table");

    if (!table) {
        setTimeout(highlightAtRisk, 100);
        return;
    }

    let {configs} = await browser.storage.local.get("configs");
    if(!configs){
        configs = {canvas_hours: 4}
        browser.storage.local.set({configs})
    }

    const course = await courseInfo();
    const courseStartDate = new Date(course.start_at);
    const now = new Date();
    let expectedTime = now.getTime() - courseStartDate.getTime();
    const expectedTimeOnCanvasPerDay = configs.canvas_hours * 60 * 60 * 1000;
    // Remove the weekends time by getting the weeks the course takes minus hoursExpectedPerDay * 2days * weeks
    const weeks = Math.floor(expectedTime / (7 * expectedTimeOnCanvasPerDay))
    expectedTime -= expectedTimeOnCanvasPerDay * 2 * weeks;
    
    let expectedHours = Math.floor(expectedTime / expectedTimeOnCanvasPerDay);

    table.querySelectorAll("tbody tr").forEach(row => {
        let cols = row.querySelectorAll("td");
        let role = cols[4].innerText;
        
        if(role !== "Student") return;

        let studentName = cols[1].innerText;
        let studentEmail = cols[2].innerText;
        let timeColumn = cols[cols.length - 2]
        // time spent
        const [hr, min, sec] = timeColumn.innerText.split(":");
        const pd = hr / expectedHours;
        const div = timeColumn.querySelector('div');
        div.style.padding = "5px"

        if(pd <= 0.2) div.style.backgroundColor = `rgba(255, 0, 0, 1)`;
        else if( pd <= 0.3 ) div.style.backgroundColor = `rgba(255, 0, 0, .4)`;
        else if(pd <= 0.6) div.style.backgroundColor = `rgba(255, 255, 0, .4)`;

    });
}

async function courseInfo() {
    var url = window.location.href;
    var urlParts = url.split("/");
    if (urlParts.includes("courses")) {
        var courseId = urlParts[urlParts.indexOf("courses") + 1];
        return await fetch(`${window.location.protocol}//${window.location.host}/api/v1/courses/${courseId}`).then(resp => resp.json());
    }
    return null;
}

//initialize
highlightAtRisk();